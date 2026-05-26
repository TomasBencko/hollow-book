import { useCallback, useEffect, useReducer } from 'react';

import LoadingIndicator from './components/loading-indicator.jsx';
import SceneChoices from './components/scene-choices.jsx';
import SceneImage from './components/scene-image.jsx';
import SceneInput from './components/scene-input.jsx';
import { appendToHistory, startGame, submitChoice } from './game.service.js';
import { GAME_STATE_ACTIONS, gameReducer, getScreenFromScene, initialGameState } from './game.state.js';

export default function Game({ stepsPlanned, onEnd, onError }) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    stepsPlanned,
    isLoading: true,
  });

  const handleSceneResult = useCallback((scene, imageUrl, history, rejection = null) => {
    dispatch({
      type: GAME_STATE_ACTIONS.SET_SCENE,
      payload: { scene, imageUrl, history, rejection },
    });

    const nextScreen = getScreenFromScene(scene);
    if (nextScreen !== 'game') {
      onEnd(nextScreen, scene);
    }
  }, [onEnd]);

  const runStart = useCallback(async () => {
    dispatch({ type: GAME_STATE_ACTIONS.SET_LOADING, payload: true });

    try {
      const { scene, imageUrl } = await startGame(stepsPlanned);
      const history = appendToHistory([], 'Začni novú hru.', scene);
      handleSceneResult(scene, imageUrl, history);
    } catch (error) {
      dispatch({ type: GAME_STATE_ACTIONS.SET_ERROR, payload: error.message });
      onError?.(error.message);
    }
  }, [stepsPlanned, handleSceneResult, onError]);

  const handleChoice = useCallback(async (payload) => {
    if (state.isLoading || !state.currentScene) return;

    dispatch({ type: GAME_STATE_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: GAME_STATE_ACTIONS.SET_REJECTION, payload: null });

    try {
      const { scene, imageUrl } = await submitChoice(state.history, stepsPlanned, payload);

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
  }, [state.isLoading, state.currentScene, state.history, state.imageUrl, stepsPlanned, handleSceneResult]);

  useEffect(() => {
    if (!state.currentScene) {
      runStart();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scene = state.currentScene;

  if (!scene) {
    return (
      <div className="screen">
        {state.error && <div className="error-banner">{state.error}</div>}
        <LoadingIndicator message="Pripravujem príbeh..." />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="step-indicator">
        Krok {scene.stepNumber} / {scene.stepsPlanned}
      </div>

      <SceneImage imageUrl={state.imageUrl} isLoading={state.isLoading} />

      <h2 className="scene-title">{scene.sceneTitle}</h2>
      <p className="scene-narrative">{scene.sceneNarrative}</p>

      {state.rejection && (
        <div className="rejection-banner" role="alert">
          {state.rejection}
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
  );
}
