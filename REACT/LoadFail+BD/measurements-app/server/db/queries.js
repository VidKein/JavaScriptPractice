const pool = require('./connection');
// Получение справочников для формы добавления точки
async function getProjects() {
    const result = await pool.query(`
            SELECT id, code, name
            FROM projects
            ORDER BY name;
        `);
    return result.rows;
}
// Получение мест съёмки выбранного объекта
async function getImportLocations(projectId) {
    const result = await pool.query(
        `
        SELECT id, code, name, project_id
        FROM survey_locations
        WHERE project_id = $1
        ORDER BY name;
        `,
        [projectId]
    );

    return result.rows;
}

// ИМПОРТ ИЗМЕРЕНИЙ СУЩЕСТВУЮЩИХ ТОЧЕК ИЗ CSV
async function importMonitoringPoints({
    projectId,
    locationId,
    measuredAt,
    rows,
    newPoints = []
}) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Проверяем проект, участок,
        // систему координат и метод измерений.
        const locationResult = await client.query(
            `
            SELECT
                sl.id AS location_id,
                sl.project_id,
                sl.code AS location_code,
                sl.name AS location_name,

                cs.id AS coordinate_system_id,
                cs.code AS coordinate_system_code,
                cs.name AS coordinate_system_name,

                mm.id AS measurement_method_id,
                mm.code AS measurement_method_code,
                mm.name AS measurement_method_name

            FROM survey_locations sl

            JOIN projects pr
                ON pr.id = sl.project_id

            JOIN coordinate_systems cs
                ON cs.id = sl.coordinate_system_id

            JOIN measurement_methods mm
                ON mm.id = sl.measurement_method_id

            WHERE sl.id = $1
              AND sl.project_id = $2

            FOR SHARE OF sl;
            `,
            [locationId, projectId]
        );

        if (locationResult.rows.length === 0) {
            throw new Error(
                'Участок не найден или не настроены ' +
                'система координат и метод измерений.'
            );
        }

        const location = locationResult.rows[0];

        console.log(
            'Участок импорта:',
            location.location_code,
            location.location_name
        );

        console.log(
            'Система координат:',
            location.coordinate_system_code
        );

        console.log(
            'Метод измерений:',
            location.measurement_method_code
        );

        // 2. Проверяем входные данные.
        if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error('Нет строк для импорта.');
        }

        const imported = [];
        const skipped = [];

        // 3. Обрабатываем каждую строку CSV.
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const pointNumber = String(
                row.pointNumber ?? ''
            ).trim();

            const x = Number(row.x);
            const y = Number(row.y);
            const z = Number(row.z);

            if (
                !pointNumber ||
                !Number.isFinite(x) ||
                !Number.isFinite(y) ||
                !Number.isFinite(z)
            ) {
                throw new Error(
                    `Некорректные данные в строке ${i + 1}.`
                );
            }

            // 4. Находим существующую точку
            // именно в выбранном проекте и участке.
            const pointResult = await client.query(
                `
                SELECT
                    p.id,
                    p.point_number,
                    p.project_id,
                    p.location_id,
                    p.mark_type_id

                FROM points p

                WHERE p.project_id = $1
                  AND p.location_id = $2
                  AND p.point_number = $3

                FOR SHARE;
                `,
                [
                    projectId,
                    locationId,
                    pointNumber
                ]
            );

            if (pointResult.rows.length === 0) {
                skipped.push({
                    pointNumber,
                    reason:
                        'Точка не найдена в выбранном проекте и участке.'
                });

                continue;
            }

            const point = pointResult.rows[0];

            // 5. Добавляем измерение.
            // Если измерение этой точки на указанную
            // дату уже существует, повтор не добавляем.
            const measurementResult = await client.query(
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
                VALUES (
                    $1,
                    $2::date,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
                ON CONFLICT (point_id, measured_at)
                DO NOTHING
                RETURNING
                    id,
                    point_id,
                    measured_at,
                    x,
                    y,
                    z;
                `,
                [
                    point.id,
                    measuredAt,
                    x,
                    y,
                    z,
                    row.measurementKey ?? null,
                    i + 1
                ]
            );

            if (measurementResult.rows.length > 0) {
                imported.push({
                    pointNumber,
                    measurement:
                        measurementResult.rows[0]
                });
            } else {
                skipped.push({
                    pointNumber,
                    reason:
                        'Измерение этой точки на указанную дату уже существует.'
                });
            }
        }

        // 6. Завершаем транзакцию.
        await client.query('COMMIT');

        return {
            importedCount: imported.length,
            skippedCount: skipped.length,
            imported,
            skipped
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
}
async function getImportMarkTypes() {
    const result = await pool.query(`
        SELECT id, code, name
        FROM mark_types
        ORDER BY name;
    `);

    return result.rows;
}

module.exports = {
  // Получение справочников для формы добавления точки
  getProjects,
  // Получение мест съёмки выбранного объекта
  getImportLocations,
  //ИМПОРТ ТОЧЕК МОНИТОРИНГА ИЗ CSV
  importMonitoringPoints,
  getImportMarkTypes
};


/*
//Считываем точки
async function getPointMovements() {
    const result = await pool.query(`
        WITH ordered_measurements AS (
            SELECT
                p.id AS point_id,
                p.point_number,
                sl.name AS location_name,
                pr.name AS project_name,

                TO_CHAR(m.measured_at, 'YYYY-MM-DD') AS measured_date,

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

            LEFT JOIN survey_locations AS sl
                ON sl.id = p.location_id

            LEFT JOIN measurements AS m
                ON m.point_id = p.id

            WHERE p.is_active = TRUE
        )

        SELECT
            point_id,
            point_number,
            location_name,
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
//Добавить измерения
async function getMeasurementOptions() {
    const result = await pool.query(`
        SELECT
            p.id AS point_id,
            p.point_number,
            p.project_id,
            pr.name AS project_name,
            sl.name AS location_name
        FROM points p
        JOIN projects pr ON pr.id = p.project_id
        LEFT JOIN survey_locations sl ON sl.id = p.location_id
        WHERE p.is_active = TRUE
        ORDER BY pr.name, p.point_number;
    `);

    const methods = await pool.query(`
        SELECT id, code, name
        FROM measurement_methods
        ORDER BY name;
    `);

    return {
        points: result.rows,
        methods: methods.rows
    };
}
async function addMeasurement({
    point_id,
    measurement_method_id,
    measured_at,
    x,
    y,
    z
}) {
    const result = await pool.query(
        `
        INSERT INTO measurements (
            point_id,
            measurement_method_id,
            measured_at,
            x,
            y,
            z
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `,
        [
            point_id,
            measurement_method_id || null,
            measured_at,
            x,
            y,
            z
        ]
    );

    return result.rows[0];
}

// ========================================
// СПРАВОЧНИКИ ДЛЯ ИМПОРТА CSV
// ========================================

// Получение объектов мониторинга
async function getImportProjects() {
    const result = await pool.query(`
        SELECT id, code, name
        FROM projects
        ORDER BY name;
    `);

    return result.rows;
}

// Получение систем координат
async function getImportCoordinateSystems() {
    const result = await pool.query(`
        SELECT id, code, name, epsg_code, unit
        FROM coordinate_systems
        ORDER BY name;
    `);

    return result.rows;
}

// Получение методов измерений
async function getImportMeasurementMethods() {
    const result = await pool.query(`
        SELECT id, code, name
        FROM measurement_methods
        ORDER BY name;
    `);

    return result.rows;
}

// Получение назначений точек
async function getImportPointPurposes() {
    const result = await pool.query(`
        SELECT id, code, name
        FROM point_purposes
        ORDER BY name;
    `);

    return result.rows;
}
*/