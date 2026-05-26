import { useCallback, useEffect, useReducer } from 'react';

import FormattedText from '../../shared/formatted-text.jsx';

import LoadingIndicator from './components/loading-indicator.jsx';
import SceneChoices from './components/scene-choices.jsx';
import SceneImage from './components/scene-image.jsx';
import SceneInput from './components/scene-input.jsx';
import { appendToHistory, startGame, submitChoice } from './game.service.js';
import { GAME_STATE_ACTIONS, gameReducer, getScreenFromScene, initialGameState } from './game.state.js';

export default function Game({ gameSettings, onEnd, onError }) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    stepsPlanned: gameSettings.stepsPlanned,
    isLoading: true,
  });

  const handleSceneResult = useCallback((scene, imageUrl, history, rejection = null) => {
    dispatch({
      type: GAME_STATE_ACTIONS.SET_SCENE,
      payload: { scene, imageUrl, history, rejection },
    });

    const nextScreen = getScreenFromScene(scene);
    if (nextScreen !== 'game') {
      onEnd(nextScreen, scene, imageUrl);
    }
  }, [onEnd]);

  const handleChoice = useCallback(async (payload) => {
    if (state.isLoading || !state.currentScene) return;

    dispatch({ type: GAME_STATE_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: GAME_STATE_ACTIONS.SET_REJECTION, payload: null });

    try {
      const { scene, imageUrl } = await submitChoice(state.history, gameSettings, payload);

      if (scene.status === 'rejected') {
        dispatch({
          type: GAME_STATE_ACTIONS.SET_SCENE,
          payload: {
            scene: state.currentScene,
            imageUrl: state.imageUrl,
            history: state.history,
            rejection: scene.rejectionReason || 'Tvoja odpoveď nedáva zmysel. Skús to znova.',
          },
        });
        return;
      }

      const history = appendToHistory(state.history, payload, scene);
      handleSceneResult(scene, imageUrl, history);
    } catch (error) {
      dispatch({ type: GAME_STATE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.isLoading, state.currentScene, state.history, state.imageUrl, gameSettings, handleSceneResult]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      dispatch({ type: GAME_STATE_ACTIONS.SET_LOADING, payload: true });

      try {
        const { scene, imageUrl } = await startGame(gameSettings);
        if (cancelled) return;

        const history = appendToHistory([], 'Začni novú hru.', scene);
        handleSceneResult(scene, imageUrl, history);
      } catch (error) {
        if (cancelled) return;
        dispatch({ type: GAME_STATE_ACTIONS.SET_ERROR, payload: error.message });
        onError?.(error.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [gameSettings, handleSceneResult, onError]);

  const scene = state.currentScene;

  if (!scene) {
    return (
      <div className="screen screen--game">
        <div className="game-loading-screen">
          {state.error && <div className="error-banner">{state.error}</div>}
          <LoadingIndicator message="Otváram príbeh..." />
        </div>
      </div>
    );
  }

  const progressPct = (scene.stepNumber / scene.stepsPlanned) * 100;

  return (
    <div className="screen screen--game">
      <header className="game-header">
        <span className="game-brand">Hollow Book</span>
        <div className="game-progress">
          <div className="game-progress-track">
            <div className="game-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="game-progress-label">{scene.stepNumber} / {scene.stepsPlanned}</span>
        </div>
      </header>

      <div className="game-layout">
        <div className="game-image-col">
          <SceneImage imageUrl={state.imageUrl} isLoading={state.isLoading} />
        </div>

        <div className="game-content-col" key={scene.stepNumber}>
          <h2 className="scene-title">{scene.sceneTitle}</h2>
          <FormattedText text={scene.sceneNarrative} className="scene-narrative" />

          {state.rejection && (
            <div className="rejection-banner" role="alert">
              <FormattedText text={state.rejection} inline />
            </div>
          )}

          {state.error && (
            <div className="error-banner" role="alert">
              {state.error}
            </div>
          )}

          {state.isLoading ? (
            <LoadingIndicator message="Píše sa ďalšia kapitola..." />
          ) : (
            <>
              <SceneChoices
                choices={scene.choices}
                onChoice={handleChoice}
                disabled={state.isLoading}
              />
              <SceneInput onSubmit={handleChoice} disabled={state.isLoading} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
