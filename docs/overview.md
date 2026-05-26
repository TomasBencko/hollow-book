# Hollow Book — prehľad

Interaktívna gamebook hra: LLM generuje scény a voľby, samostatný endpoint generuje ilustrácie. Stav hry je len v pamäti (reload = nová hra).

## Architektúra

```
React (Vite)  →  POST /api/story   →  Netlify Function  →  gpt-4o-mini (JSON schema)
              →  POST /api/image   →  Netlify Function  →  gpt-image-1 (low)
```

- `OPENAI_API_KEY` len v server functions (`netlify/functions/`).
- Lokálne: Vite middleware v `vite.config.js` emuluje functions na `/api/*`.
- Produkcia: `netlify.toml` redirect `/api/*` → `/.netlify/functions/:splat`.

## Obrazovky a tok

`app.jsx` prepína `screen` bez routera: `menu` → `game` → `win` | `gameover`.

1. **Menu** — téma, dĺžka textov (`concise` | `standard` | `detailed`), dĺžka hry (5 / 10 / 20 krokov interne).
2. **Štart** — `app.jsx` volá `startGame()` (iba story); po odpovedi mountne `Game` s textom, obrázok sa doťahuje asynchrónne.
3. **Hra** — `game.jsx` + `useReducer` (`game.state.js`); voľba alebo vlastný text → `submitChoice()` → nová scéna; paralelne `loadSceneImage()`.
4. **Koniec** — `status: win` | `gameover` v odpovedi scény; ending screen s poslednou ilustráciou.

`status: rejected` — krok sa neposúva, zobrazí sa `rejectionReason` nad predchádzajúcou scénou.

## Štruktúra kódu

| Cesta | Úloha |
|-------|--------|
| `src/app.jsx` | Screen switcher, boot prvej scény |
| `src/modules/menu/` | Nastavenia pred hrou |
| `src/modules/game/` | Hra, reducer, API wrappers, UI komponenty |
| `src/modules/endings/` | Win / game over |
| `src/shared/` | `api-client.js`, `formatted-text.jsx` (Markdown subset) |
| `netlify/functions/story.js` | Chat completion + JSON schema |
| `netlify/functions/image.js` | Base64 PNG → `dataUrl` |
| `netlify/functions/_openai-client.js` | SDK, schéma, system prompt |

Moduly sú **module-first**, súbory **kebab-case**. Typy cez JSDoc v `game.types.js` (žiadny TypeScript).

## Scéna (LLM výstup)

Pole vrátené zo `/api/story` (validované JSON schema v `_openai-client.js`):

- `status`, `sceneTitle`, `sceneNarrative`, `imagePrompt`, `choices[]`, `rejectionReason`, `stepNumber`, `stepsPlanned`
- Narratív a labely volieb: jednoduchý Markdown (`**bold**`, `*italic*`, odseky `\n\n`).

História pre LLM: `history` — pole `{ role, content }`; klient skladá cez `appendToHistory()` / `buildHistoryFromScene()`.

## API (klient)

Všetko cez `apiPost(name, body)` → `/api/{name}`.

- **story** — `{ action: 'start' | 'choice', stepsPlanned, theme, textLength, history?, payload? }` → `{ scene }`
- **image** — `{ prompt }` → `{ dataUrl }`

## Dizajn

Téma „Ancient Codex“ — CSS custom properties v `src/styles/base.css` (`--bg`, `--gold`, `--text`). Fonty: Cinzel, Crimson Pro. Desktop hra: split layout ≥900px (sticky obrázok vľavo).

## Plán a rozsah

Detailný MVP plán: `.cursor/plans/hollow_book_mvp_d88273a5.plan.md`. Mimo MVP: perzistencia, hudba, i18n, auth.
