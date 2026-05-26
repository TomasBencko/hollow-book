import FormattedText from '../../shared/formatted-text.jsx';

export default function GameOverScreen({ scene, imageUrl, onPlayAgain }) {
  return (
    <div className="screen ending-screen">
      {imageUrl && (
        <div className="ending-image-wrap">
          <img className="ending-image" src={imageUrl} alt="Ilustrácia konca príbehu" />
          <div className="ending-image-fade" />
        </div>
      )}
      <div className="ending-content">
        <div className="ending-badge ending-badge--gameover">✦ Koniec hry</div>
        {scene?.sceneTitle && <h1 className="ending-title">{scene.sceneTitle}</h1>}
        <FormattedText text={scene?.sceneNarrative} className="ending-text" />
        <button type="button" className="btn btn-primary btn-start" onClick={onPlayAgain}>
          Skúsiť znova
        </button>
      </div>
    </div>
  );
}
