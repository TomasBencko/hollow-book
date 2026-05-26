import { useState } from 'react';

import {
  buildGameSettings,
  STEP_OPTIONS,
  TEXT_LENGTH,
  TEXT_LENGTH_OPTIONS,
  THEME_CUSTOM_ID,
  THEME_PRESETS,
} from '../game/game.types.js';

const THEME_ICONS = {
  'dark-fantasy': '⚔️',
  'sci-fi': '🚀',
  'mystery': '🕵️',
  'post-apocalypse': '☢️',
  'horror': '👁️',
};

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
      <div className="menu-hero">
        <span className="menu-ornament">— The —</span>
        <h1 className="screen-title">Hollow Book</h1>
        <p className="screen-subtitle">
          Interaktívna <strong>gamebook</strong> hra. Každá voľba mení <em>príbeh</em> — a ilustráciu.
        </p>
      </div>

      <div className="menu-section">
        <p className="menu-section-label">Téma príbehu</p>
        <div className="theme-grid">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`theme-card${themeId === preset.id ? ' theme-card--active' : ''}`}
              onClick={() => setThemeId(preset.id)}
            >
              <span className="theme-card-icon">{THEME_ICONS[preset.id]}</span>
              <span className="theme-card-label">{preset.label}</span>
            </button>
          ))}
          <button
            type="button"
            className={`theme-card${themeId === THEME_CUSTOM_ID ? ' theme-card--active' : ''}`}
            onClick={() => setThemeId(THEME_CUSTOM_ID)}
          >
            <span className="theme-card-icon">✍️</span>
            <span className="theme-card-label">Vlastná téma</span>
          </button>
        </div>
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

      <div className="menu-section">
        <p className="menu-section-label">Dĺžka textov</p>
        <div className="segment-group" role="group" aria-label="Dĺžka textov">
          {TEXT_LENGTH_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`segment-btn${textLength === option.id ? ' segment-btn--active' : ''}`}
              onClick={() => setTextLength(option.id)}
              aria-pressed={textLength === option.id}
            >
              {option.label}
              <span className="segment-btn-hint">{option.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="menu-section">
        <p className="menu-section-label">Dĺžka hry</p>
        <div className="slider-wrapper">
          <div className="slider-header">
            <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>Počet krokov</span>
            <span className="slider-value">{stepsPlanned} krokov</span>
          </div>
          <input
            type="range"
            min={STEP_OPTIONS[0]}
            max={STEP_OPTIONS[STEP_OPTIONS.length - 1]}
            step={STEP_OPTIONS[1] - STEP_OPTIONS[0]}
            value={stepsPlanned}
            onChange={(event) => setStepsPlanned(Number(event.target.value))}
            aria-label="Počet krokov hry"
          />
          <div className="slider-ticks">
            {STEP_OPTIONS.map((steps) => (
              <span key={steps} className="slider-tick">{steps}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="menu-cta">
        <button
          type="button"
          className="btn btn-primary btn-start"
          onClick={handleStart}
          disabled={!canStart}
        >
          Otvoriť príbeh
        </button>
      </div>
    </div>
  );
}
