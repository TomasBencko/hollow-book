# Hollow Book

Interaktívna gamebook hra s AI príbehom a ilustráciami. Vyberieš tému a štýl, potom hráš voľbami alebo vlastným textom — príbeh a obrázky generuje OpenAI na pozadí.

## Požiadavky

- Node.js 20+
- [OpenAI API kľúč](https://platform.openai.com/api-keys)

## Spustenie lokálne

```bash
npm install
cp .env.example .env
```

Do `.env` doplň `OPENAI_API_KEY=sk-...`, potom:

```bash
npm run build   # voliteľné; dev funguje aj bez buildu
npm run dev
```

Otvor [http://localhost:5173](http://localhost:5173). Vite cez middleware obsluhuje `/api/story` a `/api/image` — netreba `netlify dev`.

## Deploy na Netlify

1. Push repozitára, pripoj v Netlify.
2. V dashboard → Environment variables nastav `OPENAI_API_KEY`.
3. Build command: `npm run build`, publish directory: `dist` (už v `netlify.toml`).

## Ďalšie info

Technický prehľad architektúry a API: [docs/overview.md](docs/overview.md).
