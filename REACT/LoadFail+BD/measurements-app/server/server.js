const express = require('express');
const cors = require('cors');

const {
    getProjects,
    getImportLocations,
    importMonitoringPoints,
    getImportMarkTypes
} = require('./db/queries');

const app = express();

app.use(cors());
app.use(express.json());

// СПРАВОЧНИКИ СУЩЕСТВУЮЩЕЙ ФОРМЫ
app.get('/api/projects', async (req, res) => {
    try {
        const options = await getProjects();        
        res.json(options);
    } catch (error) {
        console.error('Ошибка загрузки справочников:', error);

        res.status(500).json({
            error: 'Не удалось загрузить справочники'
        });
    }
});
// Получение мест съёмки выбранного объекта
app.get('/api/import/projects/:projectId/locations', async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isSafeInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                error: 'Некорректный ID объекта мониторинга'
            });
        }

        const locations = await getImportLocations(projectId);
        res.json(locations);
    } catch (error) {
        console.error('Ошибка получения мест съёмки:', error);

        res.status(500).json({
            error: 'Не удалось получить места съёмки'
        });
    }
});

// ИМПОРТ CSV В POSTGRESQL
app.post('/api/import/measurements', async (req, res) => {
    try {
        const {
            projectId,
            locationId,
            measurementDate,
            rows,
            newPoints = []
        } = req.body;
        // 1. Проверяем обязательные параметры
        if (
            !projectId ||
            !locationId ||
            !measurementDate
        ) {
            return res.status(400).json({
                success: false,
                error: 'Необходимо заполнить все параметры импорта'
            });
        }

        // 2. Проверяем наличие строк
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Нет строк для переноса'
            });
        }
        // 3. Проверяем формат даты
        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(measurementDate) ||
            !Number.isFinite(Date.parse(
                `${measurementDate}T00:00:00Z`
            )) ||
            new Date(
                `${measurementDate}T00:00:00Z`
            ).toISOString().slice(0, 10) !== measurementDate
        ) {
            throw new Error(
                'Некорректная дата измерения.'
            );
        }

        // 4. Передаём данные в функцию работы с PostgreSQL
        const result = await importMonitoringPoints({
            projectId,
            locationId,
            // React передаёт measurementDate,
            // функция БД принимает measuredAt.
            measuredAt: measurementDate,
            rows,
            newPoints
        });

     // 5. Возвращаем результат в React
     return res.status(200).json({
         success: true,
         message: 'Импорт успешно завершён',
         // Общая статистика
         summary: {
             totalRows: rows.length,
             importedCount: result.importedCount,
             skippedCount: result.skippedCount
         },
         // Добавленные измерения
         imported: result.imported,
         // Пропущенные точки и причины
         skipped: result.skipped
     });

    } catch (error) {
        console.error('Ошибка импорта CSV:', error);

        return res.status(500).json({
            success: false,
            error: error.message || 'Ошибка при импорте данных'
        });
    }
});
// СПРАВОЧНИК ТИПОВ ЗАКРЕПЛЕНИЯ
app.get('/api/import/mark-types', async (req, res) => {
    try {
        const markTypes = await getImportMarkTypes();

        res.json({
            success: true,
            data: markTypes
        });

    } catch (error) {
        console.error(
            'Ошибка получения типов закрепления:',
            error
        );

        res.status(500).json({
            success: false,
            error: 'Не удалось загрузить типы закрепления.'
        });
    }
});

// ========================================
// ЗАПУСК СЕРВЕРА
// ========================================

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

/*
// 1. ПОЛУЧЕНИЕ ИЗМЕРЕНИЙ
app.get('/api/points/movements', async (req, res) => {
    try {
        const points = await getPointMovements();
        res.json(points);
        console.log(points);
        
    } catch (error) {
        console.error('Ошибка получения измерений:', error);

        res.status(500).json({
            error: 'Ошибка получения точек из базы данных'
        });
    }
});


// ========================================
// 3. ПАРАМЕТРЫ ДОБАВЛЕНИЯ ИЗМЕРЕНИЯ
// ========================================

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

// ========================================
// 4. ДОБАВЛЕНИЕ ОДНОГО ИЗМЕРЕНИЯ
// ========================================

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
            x === undefined || x === '' ||
            y === undefined || y === '' ||
            z === undefined || z === ''
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

// ========================================
// 5. API ДЛЯ ИМПОРТА CSV
// ========================================

// Получение объектов мониторинга
app.get('/api/import/projects', async (req, res) => {
    try {
        const projects = await getImportProjects();
        res.json(projects);
    } catch (error) {
        console.error('Ошибка получения объектов:', error);

        res.status(500).json({
            error: 'Не удалось получить объекты мониторинга'
        });
    }
});

// Получение мест съёмки выбранного объекта
app.get('/api/import/projects/:projectId/locations', async (req, res) => {
    try {
        const projectId = Number(req.params.projectId);

        if (!Number.isSafeInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                error: 'Некорректный ID объекта мониторинга'
            });
        }

        const locations = await getImportLocations(projectId);
        res.json(locations);
    } catch (error) {
        console.error('Ошибка получения мест съёмки:', error);

        res.status(500).json({
            error: 'Не удалось получить места съёмки'
        });
    }
});

// Получение систем координат
app.get('/api/import/coordinate-systems', async (req, res) => {
    try {
        const systems = await getImportCoordinateSystems();
        res.json(systems);
    } catch (error) {
        console.error('Ошибка получения систем координат:', error);

        res.status(500).json({
            error: 'Не удалось получить системы координат'
        });
    }
});

// Получение методов измерений
app.get('/api/import/measurement-methods', async (req, res) => {
    try {
        const methods = await getImportMeasurementMethods();
        res.json(methods);
    } catch (error) {
        console.error('Ошибка получения методов измерений:', error);

        res.status(500).json({
            error: 'Не удалось получить методы измерений'
        });
    }
});

// Получение назначений точек
app.get('/api/import/point-purposes', async (req, res) => {
    try {
        const purposes = await getImportPointPurposes();
        res.json(purposes);
    } catch (error) {
        console.error('Ошибка получения назначений точек:', error);

        res.status(500).json({
            error: 'Не удалось получить назначения точек'
        });
    }
});

// ИМПОРТ ТОЧЕК МОНИТОРИНГА
app.post('/api/import/monitoring-points', async (req, res) => {
    try {
        const {
            projectId,
            locationId,
            coordinateSystemId,
            measurementMethodId,
            pointPurposeId,
            measuredAt,
            rows
        } = req.body;

        const ids = [
            projectId,
            locationId,
            coordinateSystemId,
            measurementMethodId,
            pointPurposeId
        ];

        if (
            ids.some(
                id =>
                    !Number.isSafeInteger(Number(id)) ||
                    Number(id) <= 0
            )
        ) {
            return res.status(400).json({
                error: 'Проверьте выбранные справочники'
            });
        }

        if (!measuredAt || !Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({
                error: 'Укажите дату и выберите строки для импорта'
            });
        }

        if (rows.length > 10000) {
            return res.status(400).json({
                error: 'За один раз можно импортировать не более 10000 строк'
            });
        }

        const result = await importMonitoringPoints({
            projectId: Number(projectId),
            locationId: Number(locationId),
            coordinateSystemId: Number(coordinateSystemId),
            measurementMethodId: Number(measurementMethodId),
            pointPurposeId: Number(pointPurposeId),
            measuredAt,
            rows
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Ошибка импорта CSV:', error);

        res.status(500).json({
            error: error.message || 'Не удалось импортировать CSV'
        });
    }
});
*/