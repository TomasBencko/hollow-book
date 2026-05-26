import FormattedText from '../../shared/formatted-text.jsx';

export default function WinScreen({ scene, onPlayAgain }) {
  return (
    <div className="screen">
      <h1 className="ending-title ending-title--win">Víťazstvo!</h1>
      {scene?.sceneTitle && <h2 className="scene-title">{scene.sceneTitle}</h2>}
      <FormattedText text={scene?.sceneNarrative} className="ending-text" />
      <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
        Hrať znova
      </button>
    </div>
  );
}
