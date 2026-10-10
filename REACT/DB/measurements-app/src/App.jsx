import { useEffect, useState, Fragment } from 'react';
import './index.css';

function App() {
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Загрузка данных из PostgreSQL
    const fetchMeasurements = async () => {
        const response = await fetch('/api/points/movements');

        if (!response.ok) {
            throw new Error('Ошибка получения данных с сервера');
        }

        const data = await response.json();

        console.log('Данные из базы:', data);

        setMeasurements(data);
    };

    useEffect(() => {
        fetchMeasurements()
            .catch(error => {
                console.error(error);
                setError('Не удалось получить данные');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="app">
                <h2>Загрузка данных...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="app">
            <h1>Изменения координат точек</h1>

            <MeasurementsTable
                data={measurements}
                setMeasurements={setMeasurements}
                refreshMeasurements={fetchMeasurements}
            />
        </div>
    );
}


// Таблица измерений
function MeasurementsTable({
    data,
    setMeasurements,
    refreshMeasurements
}) {
    // Выбранные точки
    const [selectedPoints, setSelectedPoints] = useState([]);

    // Выбранные даты
    const [selectedDates, setSelectedDates] = useState([]);

    // Состояние удаления точек
    const [deletingPoints, setDeletingPoints] = useState(false);

    // Состояние удаления измерений
    const [deletingDates, setDeletingDates] = useState(false);

    // Даты измерений
    const dates = [
        ...new Set(
            data.map(item => item.measured_date)
        )
    ].sort(
        (a, b) => new Date(a) - new Date(b)
    );

    // Номера точек
    const points = [
        ...new Set(
            data.map(item => item.point_number)
        )
    ].sort(
        (a, b) => String(a).localeCompare(
            String(b),
            undefined,
            { numeric: true }
        )
    );

    // Форматирование даты
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}.${month}.${year}`;
    };

    // Выбор точки
    const handleSelectPoint = (point) => {
        setSelectedPoints(previous => {
            if (previous.includes(point)) {
                return previous.filter(item => item !== point);
            }

            return [...previous, point];
        });
    };

    // Выбор всех точек
    const handleSelectAllPoints = () => {
        if (
            points.length > 0 &&
            selectedPoints.length === points.length
        ) {
            setSelectedPoints([]);
        } else {
            setSelectedPoints([...points]);
        }
    };

    // Выбор даты
    const handleSelectDate = (date) => {
        setSelectedDates(previous => {
            if (previous.includes(date)) {
                return previous.filter(item => item !== date);
            }

            return [...previous, date];
        });
    };

    // Выбор всех дат
    const handleSelectAllDates = () => {
        if (
            dates.length > 0 &&
            selectedDates.length === dates.length
        ) {
            setSelectedDates([]);
        } else {
            setSelectedDates([...dates]);
        }
    };

    // Удаление точек и связанных измерений из PostgreSQL
    const handleDeleteSelected = async () => {
        if (selectedPoints.length === 0) {
            alert('Сначала выберите точки для удаления.');
            return;
        }

        const confirmed = window.confirm(
            `Удалить из базы данных точки: ${selectedPoints.join(', ')}?\n\n` +
            'Все связанные измерения также будут удалены. ' +
            'Это действие нельзя отменить.'
        );

        if (!confirmed) return;

        setDeletingPoints(true);

        try {
            // Получаем уникальные ID выбранных точек
            const pointIds = [
                ...new Set(
                    data
                        .filter(item =>
                            selectedPoints.includes(item.point_number)
                        )
                        .map(item => item.point_id)
                        .filter(id => id !== undefined && id !== null)
                        .map(Number)
                )
            ];

            if (pointIds.length === 0) {
                throw new Error(
                    'Не найдены ID точек. Проверь, возвращает ли API поле point_id.'
                );
            }

            const response = await fetch('/api/points', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    point_ids: pointIds
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || 'Ошибка удаления точек'
                );
            }

            // Обновляем данные с сервера
            await refreshMeasurements();

            setSelectedPoints([]);
            setSelectedDates([]);

            alert(
                result.message ||
                `Удалено точек: ${result.deleted_count}`
            );

        } catch (error) {
            console.error('Ошибка удаления точек:', error);
            alert(`Не удалось удалить точки: ${error.message}`);
        } finally {
            setDeletingPoints(false);
        }
    };

    // Удаление измерений по датам
    const handleDeleteDates = async () => {
        if (selectedDates.length === 0) {
            alert('Сначала выберите даты для удаления.');
            return;
        }

        const formattedDates = selectedDates.map(formatDate);

        const confirmed = window.confirm(
            `Удалить ВСЕ измерения из базы за даты:\n\n` +
            `${formattedDates.join(', ')}?\n\n` +
            'Точки останутся в базе, но измерения за эти даты ' +
            'будут удалены. Это действие нельзя отменить.'
        );

        if (!confirmed) return;

        setDeletingDates(true);

        try {
            const response = await fetch('/api/measurements/dates', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dates: selectedDates
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || 'Ошибка удаления измерений'
                );
            }

            // Загружаем актуальные данные и пересчитываем отображение
            await refreshMeasurements();

            setSelectedDates([]);
            setSelectedPoints([]);

            alert(
                result.message ||
                `Удалено измерений: ${result.deleted_count}`
            );

        } catch (error) {
            console.error('Ошибка удаления по датам:', error);
            alert(`Не удалось удалить измерения: ${error.message}`);
        } finally {
            setDeletingDates(false);
        }
    };

    // Информация о точке
    const getPointInfo = (point) => {
        return data.find(
            item => item.point_number === point
        );
    };

    // Блокируем управление во время удаления
    const isDeleting = deletingPoints || deletingDates;

    return (
        <div className="table-container">

            {/* Панель управления */}
            <div className="table-controls">

                {/* Выбор всех точек */}
                <label className="select-all-label">
                    <input
                        type="checkbox"
                        checked={
                            points.length > 0 &&
                            points.every(point =>
                                selectedPoints.includes(point)
                            )
                        }
                        onChange={handleSelectAllPoints}
                        disabled={isDeleting || points.length === 0}
                    />

                    Выбрать все точки
                </label>

                {/* Удаление точек */}
                <button
                    type="button"
                    className="delete-button"
                    onClick={handleDeleteSelected}
                    disabled={
                        isDeleting || selectedPoints.length === 0
                    }
                >
                    {deletingPoints
                        ? 'Удаление точек...'
                        : `Удалить из БД (${selectedPoints.length})`}
                </button>

                {/* Выбор всех дат */}
                <label className="select-all-label">
                    <input
                        type="checkbox"
                        checked={
                            dates.length > 0 &&
                            dates.every(date =>
                                selectedDates.includes(date)
                            )
                        }
                        onChange={handleSelectAllDates}
                        disabled={isDeleting || dates.length === 0}
                    />

                    Выбрать все даты
                </label>

                {/* Удаление измерений по датам */}
                <button
                    type="button"
                    className="delete-button"
                    onClick={handleDeleteDates}
                    disabled={
                        isDeleting || selectedDates.length === 0
                    }
                >
                    {deletingDates
                        ? 'Удаление измерений...'
                        : `Удалить измерения (${selectedDates.length} дат)`}
                </button>

            </div>

            {/* Таблица */}
            <div className="table-scroll">
                <table className="measurements-table">

                    <thead>
                        <tr>
                            <th
                                rowSpan="2"
                                className="checkbox-header"
                            >
                                Выбор
                            </th>

                            <th rowSpan="2" className="point-header">
                                Точка
                            </th>

                            <th rowSpan="2" className="point-header">
                                Зона расположения
                            </th>

                            <th rowSpan="2" className="point-header">
                                Проект
                            </th>

                            {dates.map(date => (
                                <th
                                    key={date}
                                    colSpan="3"
                                    className="date-header"
                                >
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedDates.includes(date)}
                                            onChange={() =>
                                                handleSelectDate(date)
                                            }
                                            disabled={isDeleting}
                                            aria-label={
                                                `Выбрать дату ${formatDate(date)}`
                                            }
                                        />

                                        {' '}
                                        {formatDate(date)}
                                    </label>
                                </th>
                            ))}
                        </tr>

                        <tr>
                            {dates.map(date => (
                                <Fragment key={date}>
                                    <th className="coordinate-header">X</th>
                                    <th className="coordinate-header">Y</th>
                                    <th className="coordinate-header">Z</th>
                                </Fragment>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {points.map(point => {
                            const pointInfo = getPointInfo(point);

                            return (
                                <tr
                                    key={point}
                                    className={
                                        selectedPoints.includes(point)
                                            ? 'selected-row'
                                            : ''
                                    }
                                >
                                    <td className="checkbox-cell">
                                        <input
                                            type="checkbox"
                                            name="selectedPoints"
                                            checked={
                                                selectedPoints.includes(point)
                                            }
                                            onChange={() =>
                                                handleSelectPoint(point)
                                            }
                                            disabled={isDeleting}
                                            aria-label={
                                                `Выбрать точку ${point}`
                                            }
                                        />
                                    </td>

                                    <td className="point-number">
                                        {point}
                                    </td>

                                    <td>
                                        {pointInfo?.location_name ?? '—'}
                                    </td>

                                    <td>
                                        {pointInfo?.project_name ?? '—'}
                                    </td>

{dates.map(date => {
    // Находим измерение текущей точки за выбранную дату
    const measurement = data.find(item =>
        item.point_number === point &&
        item.measured_date === date
    );

    // Все измерения текущей точки сортируем по дате
    const pointMeasurements = data
        .filter(item => item.point_number === point)
        .sort((a, b) =>
            new Date(a.measured_date) - new Date(b.measured_date)
        );

    // Определяем дату первого измерения текущей точки
    const firstMeasurementDate =
        pointMeasurements.length > 0
            ? pointMeasurements[0].measured_date
            : null;

    // Если это первое измерение точки — показываем нули
    if (measurement && date === firstMeasurementDate) {
        return (
            <Fragment key={date}>
                <td>0.0000</td>
                <td>0.0000</td>
                <td>0.0000</td>
            </Fragment>
        );
    }

    // Если измерения за эту дату нет — показываем прочерки
    if (!measurement) {
        return (
            <Fragment key={date}>
                <td>—</td>
                <td>—</td>
                <td>—</td>
            </Fragment>
        );
    }

    // Для остальных дат выводим рассчитанные значения
    return (
        <Fragment key={date}>
            <td>{measurement.delta_x}</td>
            <td>{measurement.delta_y}</td>
            <td>{measurement.delta_z}</td>
        </Fragment>
    );
})}
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

            {points.length === 0 && (
                <p className="empty-message">
                    В базе данных нет измерений для отображения.
                </p>
            )}

        </div>
    );
}

export default App;