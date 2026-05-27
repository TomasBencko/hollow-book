import OpenAI from 'openai';

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return new OpenAI({ apiKey });
}

export const STORY_MODEL = 'gpt-5.4-nano';
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

const MARKDOWN_FORMAT_GUIDE = `
Formatting (Markdown subset — client renders it):
- sceneNarrative: split into paragraphs with a blank line (\\n\\n) between them.
- Use **bold** for key objects, sounds, actions, or dramatic beats.
- Use *italic* for inner thoughts, whispers, emphasis, or atmospheric details.
- choice labels: short inline **bold** or *italic* is OK when it helps clarity; keep labels scannable.
- rejectionReason: one short paragraph; *italic* or **bold** sparingly for tone.
- Do not use headings, links, lists, or HTML tags — only paragraphs, **bold**, and *italic*.`;

export function buildSystemPrompt(stepsPlanned, stepNumber, theme, textLength) {
  const isNearEnd = stepNumber >= stepsPlanned - 2;
  const lengthGuide = TEXT_LENGTH_GUIDE[textLength] ?? TEXT_LENGTH_GUIDE.standard;

  return `You are the narrator of an interactive gamebook adventure. Write in second person, atmospheric and immersive style.

Story theme (maintain consistently throughout the entire game):
${theme}

Game length (internal — never mention step counts or progress to the player):
- Target length: approximately ${stepsPlanned} steps (guideline only).
- You may adjust total length by ±2–3 steps if the story naturally demands it (extend for a richer climax, shorten after risky choices or early gameover).
- Set stepsPlanned in each response to your current best estimate of total steps for this playthrough.
- Current step: ${stepNumber}
${isNearEnd ? '- You are approaching your estimated end. Steer toward a natural conclusion (win or gameover) within the next 1–3 steps.' : '- Build tension and story progression naturally toward your estimated length.'}

Narrative length:
- ${lengthGuide}
${MARKDOWN_FORMAT_GUIDE}

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
