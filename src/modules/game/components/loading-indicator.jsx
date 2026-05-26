export default function LoadingIndicator({ message = 'Generujem...' }) {
  return (
    <div className="loading-indicator">
      <div className="loading-dots" aria-hidden="true">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
      <span className="loading-text">{message}</span>
    </div>
  );
}
