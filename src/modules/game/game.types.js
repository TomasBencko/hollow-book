/**
 * @typedef {'ongoing' | 'win' | 'gameover' | 'rejected'} SceneStatus
 */

/**
 * @typedef {Object} Choice
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} Scene
 * @property {SceneStatus} status
 * @property {string} sceneTitle
 * @property {string} sceneNarrative
 * @property {string} imagePrompt
 * @property {Choice[]} choices
 * @property {string|null} rejectionReason
 * @property {number} stepNumber
 * @property {number} stepsPlanned
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} role - 'user' | 'assistant'
 * @property {string} content
 */

/**
 * @typedef {Object} GameState
 * @property {number} stepsPlanned
 * @property {Scene|null} currentScene
 * @property {HistoryEntry[]} history
 * @property {string|null} imageUrl
 * @property {boolean} isLoading
 * @property {string|null} rejection
 * @property {string|null} error
 */

export const GAME_ACTIONS = {
  START: 'start',
  CHOICE: 'choice',
};

export const SCREENS = {
  MENU: 'menu',
  GAME: 'game',
  WIN: 'win',
  GAMEOVER: 'gameover',
};

export const STEP_OPTIONS = [5, 10, 15];
