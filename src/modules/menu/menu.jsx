import { useState } from 'react';

import {
  buildGameSettings,
  STEP_OPTIONS,
  TEXT_LENGTH,
  TEXT_LENGTH_OPTIONS,
  THEME_CUSTOM_ID,
  THEME_PRESETS,
} from '../game/game.types.js';

export default function Menu({ onStart }) {
  const [stepsPlanned, setStepsPlanned] = useState(10);
  const [themeId, setThemeId] = useState(THEME_PRESETS[0].id);
  const [customTheme, setCustomTheme] = useState('');
  const [textLength, setTextLength] = useState(TEXT_LENGTH.STANDARD);

  const isCustomTheme = themeId === THEME_CUSTOM_ID;
  const canStart = !isCustomTheme || customTheme.trim().length >= 3;

  const handleStart = () => {
    if (!canStart) return;

    onStart(buildGameSettings({ stepsPlanned, themeId, customTheme, textLength }));
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Hollow Book</h1>
      <p className="screen-subtitle">
        Interaktívna <strong>gamebook</strong> hra. Každá voľba mení <em>príbeh</em> — a ilustráciu.
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="theme-select">
          Téma príbehu
        </label>
        <select
          id="theme-select"
          className="form-select"
          value={themeId}
          onChange={(event) => setThemeId(event.target.value)}
        >
          {THEME_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
          <option value={THEME_CUSTOM_ID}>Vlastná téma</option>
        </select>
        {isCustomTheme && (
          <input
            type="text"
            className="form-input form-input--spaced"
            placeholder="Napíš vlastnú tému, napr. pirátske dobrodružstvo na opustenom ostrove"
            value={customTheme}
            onChange={(event) => setCustomTheme(event.target.value)}
            maxLength={200}
            aria-label="Vlastná téma príbehu"
          />
        )}
      </div>

      <div className="form-group">
        <span className="form-label">Dĺžka textov</span>
        <div className="form-radio-group" role="radiogroup" aria-label="Dĺžka textov">
          {TEXT_LENGTH_OPTIONS.map((option) => (
            <label key={option.id} className="form-radio-option">
              <input
                type="radio"
                name="text-length"
                value={option.id}
                checked={textLength === option.id}
                onChange={() => setTextLength(option.id)}
              />
              <span className="form-radio-content">
                <span className="form-radio-label">{option.label}</span>
                <span className="form-radio-hint">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

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

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleStart}
        disabled={!canStart}
      >
        Začať hru
      </button>
    </div>
  );
}
