# Hollow Book — poznámky pre agentov

AI gamebook (React + Netlify Functions + OpenAI). Detailný tok a schémy: [docs/overview.md](docs/overview.md). MVP plán (ak existuje zmena scope): `.cursor/plans/hollow_book_mvp_d88273a5.plan.md` — po implementácii z plánu ho stručne aktualizuj.

## Stack

- **Frontend:** Vite, React 19, čistý JS + JSDoc (`game.types.js`)
- **Backend:** Netlify Functions (`story.js`, `image.js`), shared `_openai-client.js` (prefix `_` = nie je endpoint)
- **Modely:** `gpt-5.4-nano` (structured JSON), `gpt-image-1` quality `low`
- **API z klienta:** `fetch` na `/api/*` cez `src/shared/api-client.js`

## Konvencie (stručne)

- **Štruktúra:** module-first pod `src/modules/{feature}/`, názvy **kebab-case**, vyhni sa `index.ts` / zbytočným barrelom.
- **Obrazovky:** bez routera — `SCREENS` v `game.types.js`, prepínanie v `app.jsx`.
- **Stav hry:** `useReducer` v `game.jsx`; globálny boot prvej scény v `app.jsx`. Žiadny localStorage.
- **Štart hry:** z click handlera v menu (`handleStart`), nie z `useEffect` (Strict Mode).
- **Story vs image:** text scény hneď po story response; obrázok v `useEffect` + skeleton (`loadSceneImage`, deduplikácia v `game.service.js`).
- **Formátovanie textu:** `formatted-text.jsx` — len vybraný Markdown subset.
- **Štýl:** `src/styles/base.css`, téma Ancient Codex; pri väčších UI zmenách môže pomôcť `.agents/skills/frontend-design/SKILL.md`.

## Kde čo hľadať

| Zmena | Súbory |
|--------|--------|
| LLM prompt / JSON schema | `netlify/functions/_openai-client.js` |
| Validácia story requestu | `netlify/functions/story.js` |
| Ilustrácie | `netlify/functions/image.js` |
| Herná logika / história | `game.service.js`, `game.state.js` |
| UI hry | `game.jsx`, `game/components/*` |
| Menu / nastavenia | `modules/menu/menu.jsx` |
| Lokálne API proxy | `vite.config.js` |

## Časté úskalia

- `rejected` scéna nezvyšuje krok — neprepisuj históriu pred úspešnou odpoveďou.
- `stepsPlanned` je pre LLM, nie pre UI (žiadny progress bar).
- Secrets len v `.env` / Netlify env, nikdy do `src/` ani commitu.
