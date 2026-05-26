export default function GameOverScreen({ scene, onPlayAgain }) {
  return (
    <div className="screen">
      <h1 className="ending-title ending-title--gameover">Koniec hry</h1>
      {scene?.sceneTitle && <h2 className="scene-title">{scene.sceneTitle}</h2>}
      <p className="ending-text">{scene?.sceneNarrative}</p>
      <button type="button" className="btn btn-primary" onClick={onPlayAgain}>
        Skúsiť znova
      </button>
    </div>
  );
}
