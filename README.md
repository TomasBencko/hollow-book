# Hollow Book

Interaktívna gamebook hra s AI-generovaným príbehom a ilustráciami.

## Stack

- React + Vite (JS)
- Netlify Functions + OpenAI SDK
- Modely: `gpt-4o-mini` (príbeh), `gpt-image-1` (ilustrácie, low quality)

## Lokálny vývoj

```bash
npm install
cp .env.example .env   # dopln OPENAI_API_KEY
npm run dev            # frontend + functions na :5173
```

Vite dev server cez vlastný middleware (`vite.config.js`) lokálne emuluje Netlify Functions na `/api/*`, takže netreba `netlify dev`. V produkcii funkcie obsluhuje Netlify natívne podľa `netlify.toml`.

## Deploy

1. Push na GitHub, pripoj repo v Netlify
2. Nastav env `OPENAI_API_KEY` v Netlify dashboard
3. Build: `npm run build`, publish: `dist`

## API

- `POST /api/story` — generovanie scény (structured JSON)
- `POST /api/image` — generovanie ilustrácie (base64 PNG)

Kľúč OpenAI je len server-side v Netlify Functions.
