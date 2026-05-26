import { useState } from 'react';

export default function SceneInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <form className="scene-input-row" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-input"
        placeholder="Alebo napíš vlastnú odpoveď..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled || !value.trim()}>
        Odoslať
      </button>
    </form>
  );
}
