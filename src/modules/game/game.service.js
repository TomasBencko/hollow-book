import { apiPost } from '../../shared/api-client.js';
import { GAME_ACTIONS } from './game.types.js';

/**
 * @param {{ action: string, stepsPlanned: number, theme: string, textLength: import('./game.types.js').TextLength, history?: import('./game.types.js').HistoryEntry[], payload?: string }} params
 * @returns {Promise<{ scene: import('./game.types.js').Scene }>}
 */
export async function fetchStory(params) {
  return apiPost('story', params);
}

/**
 * @param {string} prompt
 * @returns {Promise<{ dataUrl: string }>}
 */
export async function fetchImage(prompt) {
  return apiPost('image', { prompt });
}

/**
 * @param {import('./game.types.js').GameSettings} gameSettings
 * @returns {Promise<{ scene: import('./game.types.js').Scene, imageUrl: string|null }>}
 */
export async function startGame(gameSettings) {
  const { scene } = await fetchStory({
    action: GAME_ACTIONS.START,
    ...gameSettings,
    history: [],
  });

  const imageUrl = await loadSceneImage(scene);
  return { scene, imageUrl };
}

/**
 * @param {import('./game.types.js').HistoryEntry[]} history
 * @param {import('./game.types.js').GameSettings} gameSettings
 * @param {string} payload
 * @returns {Promise<{ scene: import('./game.types.js').Scene, imageUrl: string|null }>}
 */
export async function submitChoice(history, gameSettings, payload) {
  const { scene } = await fetchStory({
    action: GAME_ACTIONS.CHOICE,
    ...gameSettings,
    history,
    payload,
  });

  const imageUrl = scene.status === 'rejected' ? null : await loadSceneImage(scene);
  return { scene, imageUrl };
}

/**
 * @param {import('./game.types.js').Scene} scene
 * @returns {Promise<string|null>}
 */
async function loadSceneImage(scene) {
  if (!scene.imagePrompt) return null;

  try {
    const { dataUrl } = await fetchImage(scene.imagePrompt);
    return dataUrl;
  } catch (error) {
    console.error('Failed to load scene image:', error);
    return null;
  }
}

/**
 * @param {import('./game.types.js').Scene} scene
 * @returns {import('./game.types.js').HistoryEntry[]}
 */
export function buildHistoryFromScene(scene) {
  const assistantContent = [
    scene.sceneTitle,
    scene.sceneNarrative,
    scene.choices.length > 0
      ? `Možnosti: ${scene.choices.map((choice) => choice.label).join(' | ')}`
      : '',
  ].filter(Boolean).join('\n\n');

  return [{ role: 'assistant', content: assistantContent }];
}

/**
 * @param {import('./game.types.js').HistoryEntry[]} history
 * @param {string} userInput
 * @param {import('./game.types.js').Scene} scene
 * @returns {import('./game.types.js').HistoryEntry[]}
 */
export function appendToHistory(history, userInput, scene) {
  return [
    ...history,
    { role: 'user', content: userInput },
    ...buildHistoryFromScene(scene),
  ];
}
