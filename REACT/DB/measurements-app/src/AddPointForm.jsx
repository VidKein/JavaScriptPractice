import { useEffect, useState } from 'react';

function AddPointForm({ onPointAdded }) {
    const [options, setOptions] = useState({
        projects: [],
        survey_locations: [],
        mark_types: [],
        point_purposes: [],
        coordinate_systems: []
    });

    const [form, setForm] = useState({
        point_number: '',
        project_id: '',
        location_id: '',
        mark_type_id: '',
        point_purpose_id: '',
        coordinate_system_id: '',
        initial_x: '',
        initial_y: '',
        initial_z: '',
        installed_at: '',
        external_key: '',
        description: ''
    });

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Загружаем данные из справочных таблиц PostgreSQL
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const response = await fetch('/api/point-options');

                if (!response.ok) {
                    throw new Error('Не удалось загрузить справочники');
                }

                const data = await response.json();

                setOptions({
                    projects: data.projects ?? [],
                    survey_locations: data.survey_locations ?? [],
                    mark_types: data.mark_types ?? [],
                    point_purposes: data.point_purposes ?? [],
                    coordinate_systems: data.coordinate_systems ?? []
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingOptions(false);
            }
        };

        loadOptions();
    }, []);

    // Обновление полей формы
    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

        setError('');
        setSuccess('');
    };

    // Добавление точки в PostgreSQL
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (
            !form.point_number.trim() ||
            !form.project_id ||
            !form.coordinate_system_id ||
            form.initial_x.trim() === '' ||
            form.initial_y.trim() === '' ||
            form.initial_z.trim() === ''
        ) {
            setError(
                'Заполни номер точки, проект, систему координат и координаты X, Y, Z.'
            );
            return;
        }

        const coordinateFields = [
            ['X', form.initial_x],
            ['Y', form.initial_y],
            ['Z', form.initial_z]
        ];

        for (const [name, value] of coordinateFields) {
            if (!Number.isFinite(Number(value))) {
                setError(`Координата ${name} должна быть числом.`);
                return;
            }
        }

        setSaving(true);

        try {
            const response = await fetch('/api/points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...form,
                    point_number: form.point_number.trim(),
                    project_id: Number(form.project_id),
                    location_id: form.location_id
                        ? Number(form.location_id)
                        : null,
                    mark_type_id: form.mark_type_id
                        ? Number(form.mark_type_id)
                        : null,
                    point_purpose_id: form.point_purpose_id
                        ? Number(form.point_purpose_id)
                        : null,
                    coordinate_system_id: Number(
                        form.coordinate_system_id
                    ),
                    initial_x: Number(form.initial_x),
                    initial_y: Number(form.initial_y),
                    initial_z: Number(form.initial_z),
                    installed_at: form.installed_at || null,
                    external_key: form.external_key.trim() || null,
                    description: form.description.trim() || null
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || 'Не удалось добавить точку'
                );
            }

            setSuccess(
                `Точка ${form.point_number} успешно добавлена.`
            );

            setForm({
                point_number: '',
                project_id: '',
                location_id: '',
                mark_type_id: '',
                point_purpose_id: '',
                coordinate_system_id: '',
                initial_x: '',
                initial_y: '',
                initial_z: '',
                installed_at: '',
                external_key: '',
                description: ''
            });

            // Обновляем основную таблицу
            if (onPointAdded) {
                await onPointAdded();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loadingOptions) {
        return <p>Загрузка справочников...</p>;
    }

    const renderSelect = (
        name,
        label,
        items,
        required = false
    ) => (
        <label className="add-point-field">
            <span>{label}{required ? ' *' : ''}</span>

            <select
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={required}
                disabled={saving}
            >
                <option value="">Выбери значение</option>

                {items.map(item => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                        {item.code ? ` (${item.code})` : ''}
                    </option>
                ))}
            </select>
        </label>
    );

    const renderInput = (
        name,
        label,
        type = 'text',
        required = false
    ) => (
        <label className="add-point-field">
            <span>{label}{required ? ' *' : ''}</span>

            <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={required}
                disabled={saving}
                step={type === 'number' ? 'any' : undefined}
            />
        </label>
    );

    return (
        <section className="add-point-form">
            <h2>Добавить точку</h2>

            <form onSubmit={handleSubmit}>
                <div className="add-point-grid">

                    {renderInput(
                        'point_number',
                        'Номер точки',
                        'text',
                        true
                    )}

                    {renderSelect(
                        'project_id',
                        'Проект',
                        options.projects,
                        true
                    )}

                    {renderSelect(
                        'location_id',
                        'Зона расположения',
                        options.survey_locations
                    )}

                    {renderSelect(
                        'mark_type_id',
                        'Тип марки',
                        options.mark_types
                    )}

                    {renderSelect(
                        'point_purpose_id',
                        'Назначение точки',
                        options.point_purposes
                    )}

                    {renderSelect(
                        'coordinate_system_id',
                        'Система координат',
                        options.coordinate_systems,
                        true
                    )}

                    {renderInput(
                        'initial_x',
                        'Начальная координата X',
                        'number',
                        true
                    )}

                    {renderInput(
                        'initial_y',
                        'Начальная координата Y',
                        'number',
                        true
                    )}

                    {renderInput(
                        'initial_z',
                        'Начальная координата Z',
                        'number',
                        true
                    )}

                    {renderInput(
                        'installed_at',
                        'Дата установки',
                        'date'
                    )}

                    {renderInput(
                        'external_key',
                        'Внешний идентификатор'
                    )}

                    {renderInput(
                        'description',
                        'Описание'
                    )}

                </div>

                <p className="add-point-hint">
                    * — обязательные поля
                </p>

                {error && (
                    <p className="add-point-error" role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="add-point-success" role="status">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="add-point-button"
                >
                    {saving ? 'Сохранение...' : 'Добавить точку'}
                </button>
            </form>
        </section>
    );
}

export default AddPointForm;