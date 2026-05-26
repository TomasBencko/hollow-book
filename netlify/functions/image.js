import {
  getOpenAIClient,
  IMAGE_MODEL,
  jsonResponse,
  parseBody,
} from './_openai-client.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const body = parseBody(event);

  if (!body?.prompt || typeof body.prompt !== 'string') {
    return jsonResponse(400, { error: 'Missing prompt' });
  }

  try {
    const openai = getOpenAIClient();
    const response = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt: body.prompt,
      size: '1024x1024',
      quality: 'low',
      n: 1,
    });

    const b64 = response.data[0]?.b64_json;

    if (!b64) {
      return jsonResponse(502, { error: 'No image data returned' });
    }

    return jsonResponse(200, { dataUrl: `data:image/png;base64,${b64}` });
  } catch (error) {
    console.error('Image function error:', error);
    return jsonResponse(500, { error: error.message || 'Internal server error' });
  }
}
