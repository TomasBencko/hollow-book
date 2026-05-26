import {
  buildSystemPrompt,
  getOpenAIClient,
  jsonResponse,
  parseBody,
  SCENE_JSON_SCHEMA,
  STORY_MODEL,
  TEXT_LENGTH_VALUES,
} from './_openai-client.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const body = parseBody(event);

  if (!body) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const { action, stepsPlanned, theme, textLength, history = [], payload } = body;

  if (!action || !stepsPlanned || typeof stepsPlanned !== 'number') {
    return jsonResponse(400, { error: 'Missing action or stepsPlanned' });
  }

  if (!theme || typeof theme !== 'string') {
    return jsonResponse(400, { error: 'Missing theme' });
  }

  if (!textLength || !TEXT_LENGTH_VALUES.includes(textLength)) {
    return jsonResponse(400, { error: 'Missing or invalid textLength' });
  }

  const stepNumber = action === 'start' ? 1 : (history.filter((entry) => entry.role === 'assistant').length + 1);

  try {
    const openai = getOpenAIClient();
    const messages = buildMessages(action, stepsPlanned, stepNumber, theme, textLength, history, payload);
    const completion = await openai.chat.completions.create({
      model: STORY_MODEL,
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: SCENE_JSON_SCHEMA,
      },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return jsonResponse(502, { error: 'Empty response from OpenAI' });
    }

    const scene = JSON.parse(content);
    return jsonResponse(200, { scene });
  } catch (error) {
    console.error('Story function error:', error);
    return jsonResponse(500, { error: error.message || 'Internal server error' });
  }
}

function buildMessages(action, stepsPlanned, stepNumber, theme, textLength, history, payload) {
  const messages = [
    {
      role: 'system',
      content: buildSystemPrompt(stepsPlanned, stepNumber, theme, textLength),
    },
  ];

  for (const entry of history) {
    messages.push({ role: entry.role, content: entry.content });
  }

  if (action === 'start') {
    messages.push({
      role: 'user',
      content: `Začni novú hru v téme: ${theme}. Vytvor úvodnú scénu s 2-3 možnosťami ako pokračovať.`,
    });
  } else if (action === 'choice') {
    messages.push({
      role: 'user',
      content: payload || 'Pokračuj.',
    });
  }

  return messages;
}
