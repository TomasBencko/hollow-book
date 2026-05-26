import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import FormattedText from '../../shared/formatted-text.jsx';

import LoadingIndicator from './components/loading-indicator.jsx';
import SceneChoices from './components/scene-choices.jsx';
import SceneImage from './components/scene-image.jsx';
import SceneInput from './components/scene-input.jsx';
import { appendToHistory, submitChoice } from './game.service.js';
import { GAME_STATE_ACTIONS, gameReducer, getScreenFromScene, initialGameState } from './game.state.js';

export default function Game({ gameSettings, initialState, onEnd }) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    stepsPlanned: gameSettings.stepsPlanned,
    currentScene: initialState.scene,
    imageUrl: initialState.imageUrl,
    history: initialState.history,
  });
  const [customInputValue, setCustomInputValue] = useState('');
  const [pendingSelection, setPendingSelection] = useState(null);
  const lastStepRef = useRef(initialState.scene.stepNumber);
  const submittingRef = useRef(false);
  const isInteractionLocked = state.isLoading || pendingSelection !== null;

  useEffect(() => {
    const stepNumber = state.currentScene?.stepNumber;
    if (stepNumber == null || stepNumber === lastStepRef.current) return;

    lastStepRef.current = stepNumber;
    setCustomInputValue('');
    setPendingSelection(null);
  }, [state.currentScene?.stepNumber]);

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

  const handleChoice = useCallback(async (payload, source = 'choice') => {
    if (submittingRef.current || !state.currentScene) return;

    submittingRef.current = true;
    setPendingSelection({ type: source, value: payload });
    dispatch({ type: GAME_STATE_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: GAME_STATE_ACTIONS.SET_REJECTION, payload: null });

    try {
      const { scene, imageUrl } = await submitChoice(state.history, gameSettings, payload);

      if (scene.status === 'rejected') {
        setPendingSelection(null);
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
      setPendingSelection(null);
      dispatch({ type: GAME_STATE_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      submittingRef.current = false;
    }
  }, [state.currentScene, state.history, state.imageUrl, gameSettings, handleSceneResult]);

  const handlePresetChoice = useCallback((label) => {
    handleChoice(label, 'choice');
  }, [handleChoice]);

  const handleCustomChoice = useCallback((text) => {
    handleChoice(text, 'custom');
  }, [handleChoice]);

  const scene = state.currentScene;
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

          <div className="scene-actions">
            <SceneChoices
              choices={scene.choices}
              onChoice={handlePresetChoice}
              disabled={isInteractionLocked}
              selectedLabel={pendingSelection?.type === 'choice' ? pendingSelection.value : null}
            />
            <SceneInput
              value={customInputValue}
              onChange={setCustomInputValue}
              onSubmit={handleCustomChoice}
              disabled={isInteractionLocked}
              isPending={pendingSelection?.type === 'custom'}
            />
            {isInteractionLocked && (
              <div className="scene-pending">
                <LoadingIndicator variant="chapter" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
