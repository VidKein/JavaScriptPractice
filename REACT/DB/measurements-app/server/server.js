const express = require('express');
const cors = require('cors');
//Считывание
const { getPointMovements } = require('./db/queries');
//Удаление по номеру точки
const { deletePoints } = require('./db/queries');
//Удаление по дате
const { deleteMeasurementsByDates } = require('./db/queries');

const app = express();

app.use(cors());
app.use(express.json());

//Считывание
app.get('/api/points/movements', async (req, res) => {
  try {
    const points = await getPointMovements();
    res.json(points);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Ошибка получения точек из базы данных',
    });
  }
});

//Удаление
// Удаление точек из PostgreSQL
app.delete('/api/points', async (req, res) => {
    try {
        const { point_ids } = req.body;

        // Проверяем входные данные
        if (
            !Array.isArray(point_ids) ||
            point_ids.length === 0
        ) {
            return res.status(400).json({
                error: 'Не выбраны точки для удаления'
            });
        }

        // Проверяем, что переданы положительные целые ID
        const validIds = point_ids.every(
            id =>
                (typeof id === 'number' ||
                    (typeof id === 'string' && /^\d+$/.test(id))) &&
                Number.isSafeInteger(Number(id)) &&
                Number(id) > 0
        );

        if (!validIds) {
            return res.status(400).json({
                error: 'Переданы некорректные ID точек'
            });
        }

        const uniqueIds = [...new Set(point_ids.map(String))];

        const deletedCount = await deletePoints(uniqueIds);

        return res.json({
            success: true,
            deleted_count: deletedCount,
            message: `Удалено точек: ${deletedCount}`
        });

    } catch (error) {
        console.error('Ошибка удаления точек:', error);

        return res.status(500).json({
            error: 'Не удалось удалить точки из базы данных'
        });
    }
});
const PORT = 4000;
 // Удаление измерений по датам
app.delete('/api/measurements/dates', async (req, res) => {
    try {
        const { dates } = req.body;

        // Проверяем, что передан массив дат
        if (
            !Array.isArray(dates) ||
            dates.length === 0
        ) {
            return res.status(400).json({
                error: 'Выберите хотя бы одну дату'
            });
        }

        // Проверяем формат YYYY-MM-DD
        const validDates = dates.every(date => {
            if (
                typeof date !== 'string' ||
                !/^\d{4}-\d{2}-\d{2}$/.test(date)
            ) {
                return false;
            }

            const parsed = new Date(`${date}T00:00:00Z`);

            return (
                !Number.isNaN(parsed.getTime()) &&
                parsed.toISOString().slice(0, 10) === date
            );
        });

        if (!validDates) {
            return res.status(400).json({
                error: 'Переданы некорректные даты'
            });
        }

        const uniqueDates = [...new Set(dates)];

        const deletedCount =
            await deleteMeasurementsByDates(uniqueDates);

        return res.json({
            success: true,
            deleted_count: deletedCount,
            message: `Удалено измерений: ${deletedCount}`
        });

    } catch (error) {
        console.error(
            'Ошибка удаления измерений по датам:',
            error
        );

        return res.status(500).json({
            error: 'Не удалось удалить измерения из базы данных'
        });
    }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});