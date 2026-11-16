import { useEffect, useState } from 'react';

function AddMeasurementForm({ onMeasurementAdded }) {
    const [points, setPoints] = useState([]);

    const [formData, setFormData] = useState({
        point_id: '',
        measured_at: new Date().toISOString().slice(0, 16),
        x: '',
        y: '',
        z: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // =========================================
    // Загрузка точек из БД
    // =========================================

    useEffect(() => {
        async function loadOptions() {
            try {
                const response = await fetch('/api/measurement-options');

                if (!response.ok) {
                    throw new Error(
                        'Не удалось загрузить список точек'
                    );
                }

                const data = await response.json();

                // Проверяем, что API вернул массив
                if (!Array.isArray(data.points)) {
                    throw new Error(
                        'API не вернул список точек в правильном формате'
                    );
                }

                setPoints(data.points);

            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadOptions();
    }, []);

    // =========================================
    // Изменение полей формы
    // =========================================

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));
    }

    // =========================================
    // Сохранение измерения
    // =========================================

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');

        if (!formData.point_id) {
            setMessage('Выберите точку.');
            return;
        }

        if (
            formData.x === '' ||
            formData.y === '' ||
            formData.z === ''
        ) {
            setMessage('Заполните все координаты X, Y и Z.');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/measurements', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    point_id: formData.point_id,
                    measured_at: new Date(
                        formData.measured_at
                    ).toISOString(),
                    x: Number(formData.x),
                    y: Number(formData.y),
                    z: Number(formData.z)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    'Ошибка добавления измерения'
                );
            }

            setMessage('Измерение успешно добавлено!');

            setFormData(previous => ({
                ...previous,
                x: '',
                y: '',
                z: ''
            }));

            if (onMeasurementAdded) {
                await onMeasurementAdded();
            }

        } catch (error) {
            setMessage(error.message);
        } finally {
            setSaving(false);
        }
    }

    // =========================================
    // Состояния загрузки
    // =========================================

    if (loading) {
        return <p>Загрузка данных формы...</p>;
    }

    // =========================================
    // Форма
    // =========================================

    return (
        <section className="measurement-form">

            <h2>Добавить измерение</h2>

            <form onSubmit={handleSubmit}>

                {/* Выбор точки */}

                <label>
                    Точка

                    <select
                        name="point_id"
                        value={formData.point_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Выберите точку
                        </option>

                        {points.map(point => (
                            <option
                                key={point.point_id}
                                value={point.point_id}
                            >
                                {point.point_number}
                                {' — '}
                                {point.project_name}
                                {point.location_name
                                    ? ` / ${point.location_name}`
                                    : ''}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Информация о выбранной точке */}

                {formData.point_id && (() => {
                    const selectedPoint = points.find(
                        point =>
                            String(point.point_id) ===
                            String(formData.point_id)
                    );

                    if (!selectedPoint) {
                        return null;
                    }

                    return (
                        <div className="measurement-point-info">

                            <p>
                                <strong>Проект:</strong>{' '}
                                {selectedPoint.project_name}
                            </p>

                            <p>
                                <strong>Участок:</strong>{' '}
                                {selectedPoint.location_name}
                            </p>

                            <p>
                                <strong>Система координат:</strong>{' '}
                                {selectedPoint.coordinate_system_name}
                            </p>

                            <p>
                                <strong>Метод измерений:</strong>{' '}
                                {selectedPoint.measurement_method_name}
                            </p>

                        </div>
                    );
                })()}

                {/* Дата измерения */}

                <label>
                    Дата и время измерения

                    <input
                        type="datetime-local"
                        name="measured_at"
                        value={formData.measured_at}
                        onChange={handleChange}
                        required
                    />
                </label>

                {/* Координаты */}

                <div className="measurement-coordinates">

                    <label>
                        X

                        <input
                            type="number"
                            name="x"
                            step="any"
                            value={formData.x}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Y

                        <input
                            type="number"
                            name="y"
                            step="any"
                            value={formData.y}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Z

                        <input
                            type="number"
                            name="z"
                            step="any"
                            value={formData.z}
                            onChange={handleChange}
                            required
                        />
                    </label>

                </div>

                {/* Кнопка сохранения */}

                <button
                    type="submit"
                    disabled={saving || points.length === 0}
                >
                    {saving
                        ? 'Сохранение...'
                        : 'Сохранить измерение'}
                </button>

                {points.length === 0 && (
                    <p>
                        Нет доступных активных точек.
                    </p>
                )}

            </form>

            {/* Сообщения */}

            {message && (
                <p
                    className="measurement-message"
                    role="status"
                >
                    {message}
                </p>
            )}

        </section>
    );
}

export default AddMeasurementForm;