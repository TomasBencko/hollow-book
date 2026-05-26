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

/** @typedef {'fast' | 'medium' | 'long'} GameLength */

export const GAME_LENGTH = {
  FAST: 'fast',
  MEDIUM: 'medium',
  LONG: 'long',
};

export const GAME_LENGTH_OPTIONS = [
  { id: GAME_LENGTH.FAST, label: 'Rýchla hra', hint: 'Krátke dobrodružstvo' },
  { id: GAME_LENGTH.MEDIUM, label: 'Stredná hra', hint: 'Vyvážené tempo' },
  { id: GAME_LENGTH.LONG, label: 'Dlhá hra', hint: 'Rozsiahlejší príbeh' },
];

/** Orientačný počet krokov pre LLM — nie je zobrazený hráčovi. */
export const GAME_LENGTH_STEPS = {
  fast: 5,
  medium: 10,
  long: 20,
};

export const THEME_CUSTOM_ID = 'custom';

export const THEME_PRESETS = [
  {
    id: 'dark-fantasy',
    label: 'Temná fantasy',
    prompt: 'Temná fantasy: mystické ruiny, mágia, stredoveká atmosféra, nebezpečenstvo za každým rohom',
  },
  {
    id: 'sci-fi',
    label: 'Sci-fi',
    prompt: 'Sci-fi: vesmír, budúcnosť, pokročilé technológie, neznáme svety a civilizácie',
  },
  {
    id: 'mystery',
    label: 'Detektívka / noir',
    prompt: 'Detektívka a noir: mesto v daždi, záhady, stopy, napätie a neistota',
  },
  {
    id: 'post-apocalypse',
    label: 'Post-apokalypsa',
    prompt: 'Post-apokalypsa: opustený svet, prežitie, ruinované mestá, nedostatok zdrojov',
  },
  {
    id: 'horror',
    label: 'Horor',
    prompt: 'Horor: temnota, nadprirodzeno, rastúci strach, claustrofobická atmosféra',
  },
];

/**
 * @typedef {'concise' | 'standard' | 'detailed'} TextLength
 */

export const TEXT_LENGTH = {
  CONCISE: 'concise',
  STANDARD: 'standard',
  DETAILED: 'detailed',
};

export const TEXT_LENGTH_OPTIONS = [
  { id: TEXT_LENGTH.CONCISE, label: 'Stručné', hint: 'Krátke odseky, rýchle tempo' },
  { id: TEXT_LENGTH.STANDARD, label: 'Štandardné', hint: 'Vyvážený popis a tempo' },
  { id: TEXT_LENGTH.DETAILED, label: 'Rozpísané', hint: 'Bohatý popis, viac atmosféry' },
];

/**
 * @typedef {Object} GameSettings
 * @property {number} stepsPlanned - orientačný počet krokov pre LLM (5 / 10 / 20)
 * @property {string} theme
 * @property {TextLength} textLength
 */

/**
 * @param {{ gameLength: GameLength, themeId: string, customTheme: string, textLength: TextLength }} params
 * @returns {GameSettings}
 */
export function buildGameSettings({ gameLength, themeId, customTheme, textLength }) {
  const theme = themeId === THEME_CUSTOM_ID
    ? customTheme.trim()
    : THEME_PRESETS.find((preset) => preset.id === themeId)?.prompt ?? THEME_PRESETS[0].prompt;

  return { stepsPlanned: GAME_LENGTH_STEPS[gameLength], theme, textLength };
}
