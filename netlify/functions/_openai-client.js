import OpenAI from 'openai';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return new OpenAI({ apiKey });
}

export const STORY_MODEL = 'gpt-4o-mini';
export const IMAGE_MODEL = 'gpt-image-1';

export const SCENE_JSON_SCHEMA = {
  name: 'game_scene',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['ongoing', 'win', 'gameover', 'rejected'],
      },
      sceneTitle: { type: 'string' },
      sceneNarrative: { type: 'string' },
      imagePrompt: { type: 'string' },
      choices: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
          },
          required: ['id', 'label'],
          additionalProperties: false,
        },
      },
      rejectionReason: {
        type: ['string', 'null'],
      },
      stepNumber: { type: 'number' },
      stepsPlanned: { type: 'number' },
    },
    required: [
      'status',
      'sceneTitle',
      'sceneNarrative',
      'imagePrompt',
      'choices',
      'rejectionReason',
      'stepNumber',
      'stepsPlanned',
    ],
    additionalProperties: false,
  },
};

export const TEXT_LENGTH_VALUES = ['concise', 'standard', 'detailed'];

const TEXT_LENGTH_GUIDE = {
  concise: 'Stručné texty: sceneNarrative max 2-4 vety, choice labels jedna krátka veta.',
  standard: 'Štandardné texty: sceneNarrative 1-2 odseky, choice labels jedna jasná veta.',
  detailed: 'Rozpísané texty: sceneNarrative 2-3 odseky s bohatými detailmi, choice labels môžu byť dlhšie.',
};

export function buildSystemPrompt(stepsPlanned, stepNumber, theme, textLength) {
  const isNearEnd = stepNumber >= stepsPlanned - 1;
  const lengthGuide = TEXT_LENGTH_GUIDE[textLength] ?? TEXT_LENGTH_GUIDE.standard;

  return `You are the narrator of an interactive gamebook adventure. Write in second person, atmospheric and immersive style.

Story theme (maintain consistently throughout the entire game):
${theme}

Game parameters:
- Total planned steps: ${stepsPlanned}
- Current step: ${stepNumber}
${isNearEnd ? '- You are near the end. Begin steering toward a natural conclusion (win or gameover) within the next 1-2 steps.' : '- Build tension and story progression naturally toward the planned length.'}

Narrative length:
- ${lengthGuide}

Rules:
- Return structured JSON matching the schema exactly.
- For status "ongoing": provide 2-3 meaningful choices in the choices array.
- For status "win" or "gameover": choices must be an empty array. Write a satisfying ending in sceneNarrative.
- For status "rejected": the player's input was nonsense, off-topic, or impossible. Do NOT advance the story. Set rejectionReason explaining why, keep sceneTitle/sceneNarrative/imagePrompt reflecting the CURRENT scene (unchanged), choices empty.
- Bad player choices can lead to gameover earlier than planned.
- imagePrompt: 1-2 sentences describing the scene visually. Style must match the story theme consistently (e.g. for dark fantasy use "dark fantasy ink illustration, muted palette, atmospheric"; adapt style to theme).
- Do not end the story abruptly. Conclusions must feel earned and natural.
- Write in Slovak language for sceneTitle, sceneNarrative, choices labels, and rejectionReason.`;
}

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export function parseBody(event) {
  if (!event.body) return null;

  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
}
