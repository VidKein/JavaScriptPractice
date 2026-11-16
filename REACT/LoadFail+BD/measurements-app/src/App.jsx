import { useState, useEffect} from 'react';
import './index.css';


function App() {
    const [options, setOptions] = useState([]);
    async function poinOption() {
        const response = await fetch("/api/projects");
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    //Загрузка бд проектов
    useEffect(() => {
        async function loadOptions() {
            try {
                const data = await poinOption();
                setOptions(data);
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            }
        }
        loadOptions();
    }, []);

    // Выбранный проект и место съёмки
    const [projectId, setProjectId] = useState('');
    const [locationId, setLocationId] = useState('');
    //Список мест съёмки выбранного проекта
    const [locations, setLocations] = useState([]);

  // Загрузка мест съёмки при выборе проекта
    useEffect(() => {
        let cancelled = false;
        async function loadLocations() {
            setLocations([]);
            setLocationId('');
            if (!projectId) {
                return;
            }
            try {
                const response = await fetch(
                    `/api/import/projects/${projectId}/locations`
                );

                if (!response.ok) {
                    throw new Error(
                        `Ошибка загрузки мест съёмки: HTTP ${response.status}`
                    );
                }
                const data = await response.json();
                if (!cancelled) {
                    setLocations(data);
              }
            } catch (err) {
                if (!cancelled) {
                    console.error('Ошибка загрузки мест съёмки:', err);
                }
            }
        }
        loadLocations();
        return () => {
            cancelled = true;
        };
    }, [projectId]);
    
    //Дата
    const [measurementDate, setMeasurementDate] = useState(
    new Date().toISOString().slice(0, 10)
    );
    // Имя загруженного файла
    const [fileName, setFileName] = useState('');

    // Все строки исходного файла
    const [rows, setRows] = useState([]);

    // Ошибки загрузки
    const [error, setError] = useState('');

    // Обработка загрузки файла
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setFileName(file.name);
        setRows([]);
        setError('');

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target.result;

                // Убираем BOM в начале файла
                const cleanContent = content.replace(/^\uFEFF/, '');
                // Разделяем файл на строки
                const lines = cleanContent.split(/\r?\n/);
                // Преобразуем строки в объекты
                const parsedRows = lines
                    .filter(line => line.trim() !== '')
                    .map((line, index) => {
                        const columns = line.split(',');
                      return {
                          id: index,
                          originalLine: line,
                      
                          // Исходный номер точки
                          originalPointNumber: columns[0]?.trim() ?? '',
                      
                          // Очищенный номер точки
                          pointNumber: columns[0] ?? '',
                      
                          x: columns[1]?.trim() ?? '',
                          y: columns[2]?.trim() ?? '',
                          z: columns[3]?.trim() ?? '',
                          measurementKey: columns[4]?.trim() ?? '',
                      
                          // По умолчанию строка не переносится
                          type: 'skip'
                      };
                    });

                setRows(parsedRows);
            } catch (err) {
                console.error(err);
                setError('Не удалось обработать файл.');
            }
        };
        reader.onerror = () => {
            setError('Ошибка чтения файла.');
        };
        reader.readAsText(file, 'UTF-8');
    }

    // Изменение типа строки
    function handleTypeChange(id, type) {
        setRows(previousRows =>
            previousRows.map(row =>
                row.id === id
                    ? { ...row, type }
                    : row
            )
        );
    }

    // Итоговая таблица содержит только выбранные строки
    const finalRows = rows.filter(row => row.type !== 'skip');
    //Подготовим данные для отправки
    const importRows = finalRows.map(row => ({
    pointNumber: cleanPointNumber(row.pointNumber),
    x: Number(row.x),
    y: Number(row.y),
    z: Number(row.z),
    measurementKey: row.measurementKey,
    type: row.type,
    measuredAt: measurementDate
    }));
    //Выбранные данные
    //console.log(importRows);

    //ПОДГОТОВКА/ПРОВЕРКА и ПЕРЕНОСКА  до БД
    const [importStatus, setImportStatus] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    //ПРОВЕРКА
    function validateImport() {
        const errors = [];
    
        if (!projectId) {
            errors.push('Не выбран проект.');
        }
    
        if (!locationId) {
            errors.push('Не выбрано место съёмки.');
        }
    
        if (!measurementDate) {
            errors.push('Не указана дата измерения.');
        }
    
        if (!finalRows.length) {
            errors.push('Нет данных для переноса.');
        }
    
        finalRows.forEach((row, index) => {
        if (!row.pointNumber) {
            errors.push(`Строка ${index + 1}: отсутствует номер точки.`);
        }

        for (const coordinate of ['x', 'y', 'z']) {
            const value = row[coordinate];

            if (
                value === null ||
                value === undefined ||
                String(value).trim() === '' ||
                !Number.isFinite(Number(value))
            ) {
                errors.push(
                    `Строка ${index + 1}: координата ${coordinate.toUpperCase()} некорректна.`
                );
            }
        }
        });
    
        return errors;
    }
// ПЕРЕНОС ДАННЫХ В БД
async function handleImport() {
    const errors = validateImport();

    if (errors.length > 0) {
        setImportStatus(
            `ОШИБКИ ПРОВЕРКИ:\n${errors.join('\n')}`
        );
        return;
    }

    const payload = {
        projectId,
        locationId,
        measurementDate,
        rows: importRows
    };

    try {
        setIsImporting(true);
        setImportStatus('Выполняется импорт данных...');

        const response = await fetch('/api/import/measurements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Проверяем ответ сервера
        if (!response.ok || !result.success) {
            throw new Error(
                result.error || 'Не удалось перенести данные в БД.'
            );
        }

        // Получаем статистику импорта
        const summary = result.summary ?? {
            totalRows: importRows.length,
            importedCount: result.importedCount ?? 0,
            skippedCount: result.skippedCount ?? 0
        };

        const imported = result.imported ?? [];
        const skipped = result.skipped ?? [];

        // Формируем сообщение для отображения в React
        const statusLines = [
            '========== РЕЗУЛЬТАТ ИМПОРТА ==========',
            '',
            `Статус: ${result.message || 'Импорт завершён'}`,
            `Дата измерений: ${measurementDate}`,
            `Проект: ${
                options.find(
                    project => String(project.id) === String(projectId)
                )?.name || projectId
            }`,
            `Место съёмки: ${
                locations.find(
                    location => String(location.id) === String(locationId)
                )?.name || locationId
            }`,
            '',
            `Всего строк для переноса: ${summary.totalRows}`,
            `Успешно импортировано: ${summary.importedCount}`,
            `Пропущено: ${summary.skippedCount}`,
            '',
            '---------- ИМПОРТИРОВАННЫЕ ТОЧКИ ----------'
        ];

        if (imported.length > 0) {
            imported.forEach((item, index) => {
                const measurement = item.measurement ?? {};

                statusLines.push(
                    `${index + 1}. Точка: ${item.pointNumber}`,
                    `   ID измерения: ${measurement.id ?? '—'}`,
                    `   ID точки: ${measurement.point_id ?? '—'}`,
                    `   Дата: ${measurement.measured_at ?? measurementDate}`,
                    `   X: ${measurement.x ?? '—'}`,
                    `   Y: ${measurement.y ?? '—'}`,
                    `   Z: ${measurement.z ?? '—'}`,
                    ''
                );
            });
        } else {
            statusLines.push('Новые измерения не добавлены.', '');
        }

        statusLines.push(
            '---------- ПРОПУЩЕННЫЕ ТОЧКИ ----------'
        );

        if (skipped.length > 0) {
            skipped.forEach((item, index) => {
                statusLines.push(
                    `${index + 1}. Точка: ${item.pointNumber ?? 'Неизвестна'}`,
                    `   Причина: ${item.reason ?? 'Не указана'}`,
                    ''
                );
            });
        } else {
            statusLines.push('Пропущенных точек нет.', '');
        }

        statusLines.push(
            '========================================'
        );

        // Выводим результат непосредственно на страницу
        setImportStatus(statusLines.join('\n'));

        // Дополнительно выводим ответ сервера в консоль
        console.log('Результат импорта:', result);

    } catch (error) {
        console.error('Ошибка переноса:', error);

        setImportStatus(
            `ОШИБКА ИМПОРТА:\n${error.message}`
        );

    } finally {
        setIsImporting(false);
    }
}
    

    // Подсчёт строк каждого типа
    const orientationCount = rows.filter(
        row => row.type === 'orientation'
    ).length;

    const monitoringCount = rows.filter(
        row => row.type === 'monitoring'
    ).length;

    const skippedCount = rows.filter(
        row => row.type === 'skip'
    ).length;

    // Очистка номера точки
    function cleanPointNumber(value) {            
      const pointNumber = value.trim();
      // Удаляем точку и всё, что находится после неё,
      // только если после точки идут цифры.
      return pointNumber.replace(/\.\d+$/, '');
    }

    return (
        <div className="app">
            <h1>Загрузка геодезических измерений</h1>
            
            {/*Выбор даты*/}
            <div className="form-group">
                <label htmlFor="measurement-date">
                    Дата измерения:
                </label>
            
                <input
                    id="measurement-date"
                    type="date"
                    value={measurementDate}
                    onChange={(event) =>
                        setMeasurementDate(event.target.value)
                    }
                    required
                />
            </div>
            <section className="import-settings">
    <h2>Параметры импорта</h2>

    {
        <div className="import-settings-grid">
            {/* Проект */}       
            <div className="form-group">
                <label htmlFor="project">
                    Проект:
                </label>

                <select
                    id="project"
                    onChange={event =>
                        setProjectId(event.target.value)
                    }
                >
                    <option value="">
                        Выбери проект
                    </option>

                    { options.map(project => (
                        <option
                            key={project.id}
                            value={project.id}
                        >
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Место съёмки */}
            <div className="form-group">
                <label htmlFor="location">
                    Место съёмки:
                </label>

                <select
                    id="location"
                    value={locationId}
                    onChange={event =>
                        setLocationId(event.target.value)
                    }
                    disabled={!projectId}
                >
                    <option value="">
                        Выбери место съёмки
                    </option>
                                {locations.map(location => (
                                    <option
                                        key={location.id}
                                        value={location.id}
                                    >
                                        {location.name}
                                    </option>
                                ))}

                </select>
            </div>
        </div>
    }
</section>
            {/* Загрузка файла */}
            <section className="upload-section">
                <label htmlFor="csv-file">
                    Выбери CSV-файл:
                </label>

                <input
                    id="csv-file"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                />

                {fileName && (
                    <p>
                        Загружен файл: <strong>{fileName}</strong>
                    </p>
                )}

                {error && (
                    <p className="error-message">{error}</p>
                )}
            </section>

            {/* Исходные данные */}
            {rows.length > 0 && (
                <section>
                    <h2>1. Классификация строк</h2>

                    <p>
                        Выбери тип каждой строки. Неотмеченные строки
                        не попадут в итоговую таблицу.
                    </p>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>№</th>
                                    {/*<th>Исходная строка</th>*/}
                                    <th>Номер</th>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>Z</th>
                                    <th>Код</th>
                                    <th>Тип строки</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.id + 1}</td>

                                        {/*<td className="original-line">
                                            {row.originalLine}
                                        </td>*/}

                                        <td>{row.pointNumber}</td>
                                        <td>{row.x}</td>
                                        <td>{row.y}</td>
                                        <td>{row.z}</td>
                                        <td>{row.measurementKey || '—'}</td>

                                        <td>
                                            <div className="radio-group">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`row-${row.id}`}
                                                        checked={
                                                            row.type === 'orientation'
                                                        }
                                                        onChange={() =>
                                                            handleTypeChange(
                                                                row.id,
                                                                'orientation'
                                                            )
                                                        }
                                                    />
                                                    Ориентация
                                                </label>

                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`row-${row.id}`}
                                                        checked={
                                                            row.type === 'monitoring'
                                                        }
                                                        onChange={() =>
                                                            handleTypeChange(
                                                                row.id,
                                                                'monitoring'
                                                            )
                                                        }
                                                    />
                                                    Точка мониторинга
                                                </label>

                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`row-${row.id}`}
                                                        checked={
                                                            row.type === 'skip'
                                                        }
                                                        onChange={() =>
                                                            handleTypeChange(
                                                                row.id,
                                                                'skip'
                                                            )
                                                        }
                                                    />
                                                    Не переносить
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Итоговая таблица */}
            {rows.length > 0 && (
                <section>
                    <h2>2. Итоговая таблица</h2>
                    <div className="summary">
                        <span> Дата: {measurementDate} </span>
                        <span> Проект: {options.find(project => String(project.id) === String(projectId))?.name || 'Не выбран'} </span>
                        <span> Место съёмки: {locations.find(project => String(project.id) === String(locationId))?.name || 'Не выбран'} </span>
                        <span>
                            Ориентация: {orientationCount}
                        </span>

                        <span>
                            Точки мониторинга: {monitoringCount}
                        </span>

                        <span>
                            Не переносить: {skippedCount}
                        </span>

                        <span>
                            Всего для переноса: {finalRows.length}
                        </span>
                    </div>

                    {finalRows.length > 0 ? (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Тип</th>
                                        <th>Номер</th>
                                        <th>X</th>
                                        <th>Y</th>
                                        <th>Z</th>
                                        <th>Код</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {finalRows.map(row => (
                                        
                                        <tr key={row.id}>
                                            <td>
                                                {row.type === 'orientation'
                                                    ? 'Ориентация'
                                                    : 'Точка мониторинга'}
                                            </td>

                                            <td>{cleanPointNumber(row.pointNumber)}</td>
                                            <td>{row.x}</td>
                                            <td>{row.y}</td>
                                            <td>{row.z}</td>
                                            <td>
                                                {row.measurementKey || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        <div className="import-controls">
                          <button
                              type="button"
                              onClick={handleImport}
                              disabled={isImporting || finalRows.length === 0}
                          >
                                  {isImporting
                                      ? 'Перенос данных...'
                                      : 'Перенести в БД'}
                              </button>
                          
                              {importStatus && (
                                  <pre className="import-status">
                                      {importStatus}
                                  </pre>
                              )}
                          </div>
                        </div>
                    ) : (
                        <p>
                            Пока нет строк, выбранных для переноса.
                        </p>
                    )}
                </section>
            )}   
        </div>
        
    );
}

export default App;