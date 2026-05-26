import { SCREENS } from './game.types.js';

/** @type {import('./game.types.js').GameState} */
export const initialGameState = {
  stepsPlanned: 10,
  currentScene: null,
  history: [],
  imageUrl: null,
  isLoading: false,
  rejection: null,
  error: null,
};

export const GAME_STATE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SCENE: 'SET_SCENE',
  SET_REJECTION: 'SET_REJECTION',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
};

export function gameReducer(state, action) {
  switch (action.type) {
    case GAME_STATE_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null };

    case GAME_STATE_ACTIONS.SET_SCENE:
      return {
        ...state,
        currentScene: action.payload.scene,
        imageUrl: action.payload.imageUrl ?? state.imageUrl,
        history: action.payload.history ?? state.history,
        isLoading: false,
        rejection: action.payload.rejection ?? null,
        error: null,
      };

    case GAME_STATE_ACTIONS.SET_REJECTION:
      return {
        ...state,
        rejection: action.payload,
        isLoading: false,
        error: null,
      };

    case GAME_STATE_ACTIONS.SET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case GAME_STATE_ACTIONS.RESET:
      return { ...initialGameState, stepsPlanned: action.payload?.stepsPlanned ?? state.stepsPlanned };

    default:
      return state;
  }
}

/**
 * @param {import('./game.types.js').Scene} scene
 * @returns {string|null}
 */
export function getScreenFromScene(scene) {
  if (scene.status === 'win') return SCREENS.WIN;
  if (scene.status === 'gameover') return SCREENS.GAMEOVER;
  return SCREENS.GAME;
}
