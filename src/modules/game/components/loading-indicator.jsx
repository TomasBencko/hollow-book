import { useEffect, useState } from 'react';

const CHAPTER_MESSAGES = [
  'Píše sa ďalšia kapitola...',
  'Osud sa odvíja...',
  'Príbeh pokračuje...',
  'Listy sa otáčajú...',
];

export default function LoadingIndicator({ message = 'Generujem...', variant = 'default' }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const isChapter = variant === 'chapter';
  const displayMessage = isChapter ? CHAPTER_MESSAGES[messageIndex] : message;

  useEffect(() => {
    if (!isChapter) return undefined;

    const intervalId = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % CHAPTER_MESSAGES.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, [isChapter]);

  if (isChapter) {
    return (
      <div className="loading-indicator loading-indicator--chapter" role="status" aria-live="polite">
        <div className="codex-spinner" aria-hidden="true">
          <div className="codex-spinner-ring codex-spinner-ring--outer" />
          <div className="codex-spinner-ring codex-spinner-ring--inner" />
          <div className="codex-spinner-core">✦</div>
        </div>
        <span className="loading-text loading-text--chapter" key={displayMessage}>
          {displayMessage}
        </span>
      </div>
    );
  }

  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <div className="loading-dots" aria-hidden="true">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
      <span className="loading-text">{displayMessage}</span>
    </div>
  );
}
