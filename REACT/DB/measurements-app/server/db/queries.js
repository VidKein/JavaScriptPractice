const pool = require('./connection');

// ============================================================
// 1. Получение изменений координат точек
// ============================================================

async function getPointMovements() {
    const result = await pool.query(`
        WITH ordered_measurements AS (
            SELECT
                p.id AS point_id,
                p.point_number,
                sl.name AS location_name,
                sl.code AS location_code,
                pr.name AS project_name,

                TO_CHAR(
                    m.measured_at AT TIME ZONE 'UTC',
                    'YYYY-MM-DD'
                ) AS measured_date,

                m.measured_at,
                m.x,
                m.y,
                m.z,

                LAG(m.x) OVER (
                    PARTITION BY p.id
                    ORDER BY m.measured_at
                ) AS previous_x,

                LAG(m.y) OVER (
                    PARTITION BY p.id
                    ORDER BY m.measured_at
                ) AS previous_y,

                LAG(m.z) OVER (
                    PARTITION BY p.id
                    ORDER BY m.measured_at
                ) AS previous_z

            FROM points AS p

            JOIN projects AS pr
                ON pr.id = p.project_id

            JOIN survey_locations AS sl
                ON sl.id = p.location_id
               AND sl.project_id = p.project_id

            LEFT JOIN measurements AS m
                ON m.point_id = p.id

            WHERE p.is_active = TRUE
        )

        SELECT
            point_id,
            point_number,
            location_name,
            location_code,
            project_name,
            measured_date,

            CASE
                WHEN measured_at IS NULL THEN NULL
                WHEN previous_x IS NULL THEN '0.0000'
                ELSE
                    CASE
                        WHEN x - previous_x > 0 THEN '+'
                        ELSE ''
                    END
                    ||
                    TO_CHAR(
                        x - previous_x,
                        'FM999999999999990.0000'
                    )
            END AS delta_x,

            CASE
                WHEN measured_at IS NULL THEN NULL
                WHEN previous_y IS NULL THEN '0.0000'
                ELSE
                    CASE
                        WHEN y - previous_y > 0 THEN '+'
                        ELSE ''
                    END
                    ||
                    TO_CHAR(
                        y - previous_y,
                        'FM999999999999990.0000'
                    )
            END AS delta_y,

            CASE
                WHEN measured_at IS NULL THEN NULL
                WHEN previous_z IS NULL THEN '0.0000'
                ELSE
                    CASE
                        WHEN z - previous_z > 0 THEN '+'
                        ELSE ''
                    END
                    ||
                    TO_CHAR(
                        z - previous_z,
                        'FM999999999999990.0000'
                    )
            END AS delta_z

        FROM ordered_measurements

        ORDER BY
            measured_date NULLS LAST,
            point_number;
    `);

    return result.rows;
}


// ============================================================
// 2. Удаление точек и связанных измерений
// ============================================================

async function deletePoints(pointIds) {
    if (!Array.isArray(pointIds) || pointIds.length === 0) {
        return 0;
    }

    const result = await pool.query(
        `
        DELETE FROM points
        WHERE id = ANY($1::bigint[])
        RETURNING id;
        `,
        [pointIds]
    );

    // measurements удаляются автоматически благодаря ON DELETE CASCADE.
    return result.rowCount;
}


// ============================================================
// 3. Удаление измерений по датам
// ============================================================

async function deleteMeasurementsByDates(dates) {
    if (!Array.isArray(dates) || dates.length === 0) {
        return 0;
    }

    const result = await pool.query(
        `
        DELETE FROM measurements
        WHERE (measured_at AT TIME ZONE 'UTC')::date
              = ANY($1::date[])
        RETURNING id;
        `,
        [dates]
    );

    return result.rowCount;
}


// ============================================================
// 4. Получение справочников для формы добавления точки
// ============================================================

async function getPointOptions() {
    const queries = {
        projects: `
            SELECT id, code, name
            FROM projects
            ORDER BY name;
        `,

        survey_locations: `
            SELECT
                sl.id,
                sl.code,
                sl.name,
                sl.project_id,
                pr.name AS project_name,
                cs.id AS coordinate_system_id,
                cs.code AS coordinate_system_code,
                cs.name AS coordinate_system_name,
                cs.epsg_code,
                cs.unit,
                mm.id AS measurement_method_id,
                mm.code AS measurement_method_code,
                mm.name AS measurement_method_name
            FROM survey_locations AS sl

            JOIN projects AS pr
                ON pr.id = sl.project_id

            JOIN coordinate_systems AS cs
                ON cs.id = sl.coordinate_system_id

            JOIN measurement_methods AS mm
                ON mm.id = sl.measurement_method_id

            ORDER BY pr.name, sl.name;
        `,

        mark_types: `
            SELECT id, code, name
            FROM mark_types
            ORDER BY name;
        `,

        point_purposes: `
            SELECT id, code, name
            FROM point_purposes
            ORDER BY name;
        `,

        coordinate_systems: `
            SELECT id, code, name, epsg_code, unit
            FROM coordinate_systems
            ORDER BY name;
        `,

        measurement_methods: `
            SELECT id, code, name
            FROM measurement_methods
            ORDER BY name;
        `
    };

    const result = {};

    for (const [key, sql] of Object.entries(queries)) {
        const queryResult = await pool.query(sql);
        result[key] = queryResult.rows;
    }

    return result;
}


// ============================================================
// 5. Добавление новой точки
// ============================================================

async function createPoint(point) {
    const {
        project_id,
        location_id,
        mark_type_id,
        point_number,
        initial_x,
        initial_y,
        initial_z,
        installed_at,
        external_key,
        description,
        purpose_ids = []
    } = point;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Проверяем, что участок существует и принадлежит проекту.
        const locationResult = await client.query(
            `
            SELECT id
            FROM survey_locations
            WHERE id = $1
              AND project_id = $2;
            `,
            [location_id, project_id]
        );

        if (locationResult.rowCount === 0) {
            throw new Error(
                'Участок не найден или не принадлежит выбранному проекту.'
            );
        }

        // Система координат и метод измерений определяются участком.
        // В таблицу points они не записываются.
        const pointResult = await client.query(
            `
            INSERT INTO points (
                project_id,
                location_id,
                mark_type_id,
                point_number,
                initial_x,
                initial_y,
                initial_z,
                installed_at,
                external_key,
                description,
                is_active
            )
            VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, TRUE
            )
            RETURNING *;
            `,
            [
                project_id,
                location_id,
                mark_type_id || null,
                point_number,
                initial_x,
                initial_y,
                initial_z,
                installed_at || null,
                external_key || null,
                description || null
            ]
        );

        const createdPoint = pointResult.rows[0];

        // Назначения хранятся в отдельной таблице.
        if (purpose_ids.length > 0) {
            await client.query(
                `
                INSERT INTO point_purpose_assignments (
                    point_id,
                    purpose_id
                )
                SELECT $1, purpose_id
                FROM UNNEST($2::bigint[]) AS purpose_id
                ON CONFLICT (point_id, purpose_id) DO NOTHING;
                `,
                [createdPoint.id, purpose_ids]
            );
        }

        await client.query('COMMIT');

        return createdPoint;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
}


// ============================================================
// 6. Получение данных для формы добавления измерения
// ============================================================

async function getMeasurementOptions() {
    const pointsResult = await pool.query(`
        SELECT
            p.id AS point_id,
            p.point_number,

            p.project_id,
            pr.code AS project_code,
            pr.name AS project_name,

            sl.id AS location_id,
            sl.code AS location_code,
            sl.name AS location_name,

            cs.id AS coordinate_system_id,
            cs.code AS coordinate_system_code,
            cs.name AS coordinate_system_name,
            cs.epsg_code,
            cs.unit AS coordinate_unit,

            mm.id AS measurement_method_id,
            mm.code AS measurement_method_code,
            mm.name AS measurement_method_name

        FROM points AS p

        JOIN projects AS pr
            ON pr.id = p.project_id

        JOIN survey_locations AS sl
            ON sl.id = p.location_id
           AND sl.project_id = p.project_id

        JOIN coordinate_systems AS cs
            ON cs.id = sl.coordinate_system_id

        JOIN measurement_methods AS mm
            ON mm.id = sl.measurement_method_id

        WHERE p.is_active = TRUE

        ORDER BY
            pr.name,
            sl.name,
            p.point_number;
    `);

    return {
        points: pointsResult.rows
    };
}


// ============================================================
// 7. Добавление измерения
// ============================================================

async function addMeasurement({
    point_id,
    measured_at,
    x,
    y,
    z,
    measurement_key,
    source_row
}) {
    const result = await pool.query(
        `
        INSERT INTO measurements (
            point_id,
            measured_at,
            x,
            y,
            z,
            measurement_key,
            source_row
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)

        RETURNING *;
        `,
        [
            point_id,
            measured_at,
            x,
            y,
            z,
            measurement_key || null,
            source_row || null
        ]
    );

    return result.rows[0];
}


// ============================================================
// 8. Экспорт функций
// ============================================================

module.exports = {
    getPointMovements,
    deletePoints,
    deleteMeasurementsByDates,
    getPointOptions,
    createPoint,
    getMeasurementOptions,
    addMeasurement
};