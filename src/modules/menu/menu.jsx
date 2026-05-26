import { useState } from 'react';

import { STEP_OPTIONS } from '../game/game.types.js';

export default function Menu({ onStart }) {
  const [stepsPlanned, setStepsPlanned] = useState(10);

  const handleStart = () => {
    onStart(stepsPlanned);
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Hollow Book</h1>
      <p className="screen-subtitle">
        Interaktívna gamebook hra. Každá voľba mení príbeh — a ilustráciu.
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="steps-select">
          Dĺžka hry (počet krokov)
        </label>
        <select
          id="steps-select"
          className="form-select"
          value={stepsPlanned}
          onChange={(event) => setStepsPlanned(Number(event.target.value))}
        >
          {STEP_OPTIONS.map((steps) => (
            <option key={steps} value={steps}>
              {steps} krokov
            </option>
          ))}
        </select>
      </div>

      <button type="button" className="btn btn-primary" onClick={handleStart}>
        Začať hru
      </button>
    </div>
  );
}
