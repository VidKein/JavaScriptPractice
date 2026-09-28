import { useState } from 'react';
import './index.css';

import measurements from './date_points/measurements.js';

function App() {

  const [days, setDays] = useState(7);

  // Дата, относительно которой тестируем фильтр
  const today = new Date('2026-10-05');

  const filteredMeasurements = measurements.filter((measurement) => {

    const measurementDate = new Date(measurement.date);

    const difference =
      (today - measurementDate) / (1000 * 60 * 60 * 24);

    return difference >= 0 && difference < days;
  });

  return (
    <div className="app">

      <h1>Измерения</h1>

      <div className="filters">

        <label>
          Период:

          <select
            value={days}
            onChange={(event) =>
              setDays(Number(event.target.value))
            }
          >
            <option value="7">Последние 7 дней</option>
            <option value="14">Последние 14 дней</option>
            <option value="30">Последние 30 дней</option>
          </select>

        </label>

      </div>

      <p>
        Найдено измерений: {filteredMeasurements.length}
      </p>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Точка</th>
            <th>Дата</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
          </tr>
        </thead>

        <tbody>

          {filteredMeasurements.map((measurement) => (
            <tr key={measurement.id}>
              <td>{measurement.id}</td>
              <td>{measurement.point}</td>
              <td>{measurement.date}</td>
              <td>{measurement.x}</td>
              <td>{measurement.y}</td>
              <td>{measurement.z}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;