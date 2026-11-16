const express = require('express');
const cors = require('cors');
//Считывание
const { getPointMovements } = require('./db/queries');
//Удаление по номеру точки
const { deletePoints } = require('./db/queries');
//Удаление по дате
const { deleteMeasurementsByDates } = require('./db/queries');
//Добавление точки
const { getPointOptions } = require('./db/queries');
const { createPoint } = require('./db/queries');
//добавляем измерения
const { getMeasurementOptions } = require('./db/queries');
const { addMeasurement } = require('./db/queries');

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
//Добавление
//загрузка справочников
app.get('/api/point-options', async (req, res) => {
    try {
        const options = await getPointOptions();

        res.json(options);
    } catch (error) {
        console.error('Ошибка загрузки справочников:', error);

        res.status(500).json({
            error: 'Не удалось загрузить справочники'
        });
    }
});
//добавление точки
app.post('/api/points', async (req, res) => {
    try {
        const {
            project_id,
            location_id,
            mark_type_id,
            coordinate_system_id,
            point_number,
            initial_x,
            initial_y,
            initial_z,
            installed_at,
            external_key,
            description
        } = req.body;

        // Проверяем обязательные поля
        if (
            !point_number ||
            !String(point_number).trim() ||
            project_id == null ||
            coordinate_system_id == null ||
            initial_x == null ||
            initial_y == null ||
            initial_z == null
        ) {
            return res.status(400).json({
                error: 'Заполни номер точки, проект, систему координат и координаты X, Y, Z'
            });
        }

        // Проверяем координаты
        const coordinates = [
            initial_x,
            initial_y,
            initial_z
        ];

        if (
            coordinates.some(value =>
                value === '' ||
                !Number.isFinite(Number(value))
            )
        ) {
            return res.status(400).json({
                error: 'Координаты должны быть числами'
            });
        }

        // Проверяем идентификаторы справочников
        const ids = [
            project_id,
            coordinate_system_id,
            location_id,
            mark_type_id
        ].filter(value => value != null && value !== '');

        if (
            ids.some(value =>
                !Number.isSafeInteger(Number(value)) ||
                Number(value) <= 0
            )
        ) {
            return res.status(400).json({
                error: 'Некорректный идентификатор справочника'
            });
        }

        // Проверяем дату
        if (
            installed_at &&
            !/^\d{4}-\d{2}-\d{2}$/.test(installed_at)
        ) {
            return res.status(400).json({
                error: 'Дата установки должна быть в формате ГГГГ-ММ-ДД'
            });
        }

        const point = await createPoint({
            project_id: Number(project_id),
            location_id: location_id ? Number(location_id) : null,
            mark_type_id: mark_type_id ? Number(mark_type_id) : null,
            coordinate_system_id: Number(coordinate_system_id),
            point_number: String(point_number).trim(),
            initial_x,
            initial_y,
            initial_z,
            installed_at: installed_at || null,
            external_key: external_key || null,
            description: description || null
        });

        res.status(201).json({
            message: 'Точка успешно добавлена',
            point
        });
    } catch (error) {
        console.error('Ошибка добавления точки:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                error: 'Такая точка уже существует. Проверь номер точки и ограничения уникальности.'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                error: 'Выбранный проект, зона, тип марки или система координат не существует либо не соответствует ограничениям базы.'
            });
        }

        res.status(500).json({
            error: 'Не удалось добавить точку'
        });
    }
});
//добавляем измерения
// Получение точек и методов измерения для формы
app.get('/api/measurement-options', async (req, res) => {
    try {
        const options = await getMeasurementOptions();
        res.json(options);
    } catch (error) {
        console.error('Ошибка получения данных для измерения:', error);
        res.status(500).json({
            error: 'Не удалось загрузить данные для измерения'
        });
    }
});
// Добавление нового измерения существующей точки
app.post('/api/measurements', async (req, res) => {
    try {
        const {
            point_id,
            measurement_method_id,
            measured_at,
            x,
            y,
            z
        } = req.body;

        if (
            !point_id ||
            !measured_at ||
            x === undefined ||
            x === '' ||
            y === undefined ||
            y === '' ||
            z === undefined ||
            z === ''
        ) {
            return res.status(400).json({
                error: 'Заполните точку, дату измерения и координаты X, Y, Z'
            });
        }

        const values = [x, y, z];

        if (values.some(value => !Number.isFinite(Number(value)))) {
            return res.status(400).json({
                error: 'Координаты должны быть числами'
            });
        }

        const measurement = await addMeasurement({
            point_id,
            measurement_method_id,
            measured_at,
            x,
            y,
            z
        });

        res.status(201).json({
            message: 'Измерение успешно добавлено',
            measurement
        });
    } catch (error) {
        console.error('Ошибка добавления измерения:', error);

        res.status(500).json({
            error: 'Не удалось добавить измерение'
        });
    }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});