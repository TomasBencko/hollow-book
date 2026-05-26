export default function SceneInput({ value, onChange, onSubmit, disabled, isPending }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <form
      className={`scene-input-row${isPending ? ' scene-input-row--pending' : ''}`}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="form-input"
        placeholder="Alebo napíš vlastnú odpoveď..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-busy={isPending}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled || !value.trim()}>
        Odoslať
      </button>
    </form>
  );
}
