export default function LoadingIndicator({ message = 'Generujem...' }) {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner" />
      <span>{message}</span>
    </div>
  );
}
