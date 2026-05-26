import FormattedText from '../../shared/formatted-text.jsx';
import SceneImage from '../game/components/scene-image.jsx';

export default function GameOverScreen({ scene, imageUrl, onPlayAgain }) {
  return (
    <div className="screen">
      <SceneImage imageUrl={imageUrl} alt="Ilustrácia konca príbehu" />
      <h1 className="ending-title ending-title--gameover">Koniec hry</h1>
      {scene?.sceneTitle && <h2 className="scene-title">{scene.sceneTitle}</h2>}
      <FormattedText text={scene?.sceneNarrative} className="ending-text" />
      <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
        Skúsiť znova
      </button>
    </div>
  );
}
