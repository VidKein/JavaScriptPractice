const pool = require('./connection');
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
        m.x,
        m.y,
        m.z,

        LAG(m.x) OVER (
            PARTITION BY m.point_id
            ORDER BY m.measured_at
        ) AS previous_x,

        LAG(m.y) OVER (
            PARTITION BY m.point_id
            ORDER BY m.measured_at
        ) AS previous_y,

        LAG(m.z) OVER (
            PARTITION BY m.point_id
            ORDER BY m.measured_at
        ) AS previous_z

    FROM measurements AS m

    JOIN points AS p
        ON p.id = m.point_id

    JOIN survey_locations AS sl
        ON sl.id = p.location_id

    JOIN projects AS pr
        ON pr.id = p.project_id
)

SELECT
    point_id,
    point_number,
    location_name,
    project_name,
    measured_date,

    CASE
        WHEN previous_x IS NULL THEN '-'
        WHEN x - previous_x > 0
            THEN '+' || (x - previous_x)::text
        ELSE (x - previous_x)::text
    END AS delta_x,

    CASE
        WHEN previous_y IS NULL THEN '-'
        WHEN y - previous_y > 0
            THEN '+' || (y - previous_y)::text
        ELSE (y - previous_y)::text
    END AS delta_y,

    CASE
        WHEN previous_z IS NULL THEN '-'
        WHEN z - previous_z > 0
            THEN '+' || (z - previous_z)::text
        ELSE (z - previous_z)::text
    END AS delta_z

FROM ordered_measurements

ORDER BY
    measured_date,
    point_number;
  `);

  return result.rows;
}

// Удали выбранные точки и связанные с ними измерения
async function deletePoints(pointIds) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Удаляем измерения выбранных точек
        await client.query(
            `DELETE FROM measurements
             WHERE point_id = ANY($1::bigint[])`,
            [pointIds]
        );

        // Удаляем сами точки
        const result = await client.query(
            `DELETE FROM points
             WHERE id = ANY($1::bigint[])
             RETURNING id`,
            [pointIds]
        );

        await client.query('COMMIT');

        return result.rowCount;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
// Удаление измерений по выбранным датам
async function deleteMeasurementsByDates(dates) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `
            DELETE FROM measurements
            WHERE (measured_at AT TIME ZONE 'UTC')::date
                  = ANY($1::date[])
            RETURNING id
            `,
            [dates]
        );

        await client.query('COMMIT');

        return result.rowCount;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
  //Считываем точки
  getPointMovements,
  // Сохрани здесь существующие функции! 
  deletePoints,
  // Удаление измерений по выбранным датам
  deleteMeasurementsByDates
};