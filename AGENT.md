# agents.md — Antigravity IDE Agent Rules

> These rules are **strict and non-negotiable**. The agent must follow all of them without exception.
> If a rule conflicts with a user instruction, the rule wins. Flag the conflict instead of silently breaking it.

---

## 1. Identity & Scope

- This project is a **client-side AI chatbot** — HTML, CSS, and vanilla JavaScript only
- The agent operates on files within this repository exclusively
- The agent must not scaffold, generate, or suggest code outside this project's defined stack
- When uncertain, the agent asks for clarification rather than making assumptions

---

## 2. File Ownership

Each file has exactly one owner and one purpose. The agent must not merge responsibilities.

| File           | Owner / Purpose                                           |
|----------------|-----------------------------------------------------------|
| `index.html`   | App shell only — structure and `<script>` tags            |
| `style.css`    | All CSS — no inline styles, no `<style>` tags in HTML     |
| `app.js`       | Entry point — initialises modules, binds top-level events |
| `chat.js`      | Text chat — GPT-4o-mini API calls and message rendering   |
| `image.js`     | Image generation — gpt-image-1 API calls and rendering    |
| `history.js`   | Chat history export — Blob download logic                 |
| `router.js`    | Intent detection — returns `'chat'` or `'image'`          |
| `config.js`    | API key only — never touched by the agent                 |

**Rules:**
- The agent must never edit `config.js` under any circumstance
- The agent must never move logic from one file into another without explicit user instruction
- New files may only be created if no existing file's scope covers the need

---

## 3. Security Rules

These are absolute. No exceptions.

1. **Never read, log, print, or expose `config.js` contents**
2. **Never hardcode an API key anywhere** — not in comments, not in examples, not in placeholders (use `'YOUR_API_KEY_HERE'` in `config.example.js` only)
3. **Never suggest storing the API key in `localStorage`, `sessionStorage`, or any browser storage**
4. **Never create a backend, proxy, or server** — this is a fully client-side app
5. **Never commit `config.js`** — verify `.gitignore` contains it before any git-related action
6. If the agent detects an API key has been accidentally hardcoded anywhere, it must immediately flag it and offer to remove it

---

## 4. Code Quality Standards

### JavaScript
- `const` and `let` only — `var` is forbidden
- `async/await` only — no `.then()` / `.catch()` chains
- Every `async` function must be wrapped in `try/catch`
- Errors must surface visibly in the chat UI — silent failures are forbidden
- No `console.log` in committed code (use `console.error` in catch blocks only)
- Functions must be single-purpose and under ~20 lines
- DOM elements queried once and stored in named `const` variables

### CSS
- All styles in `style.css` — no `style=""` attributes, no `<style>` tags in HTML
- Use CSS custom properties (`--var-name`) for all colours, spacing, and animation values
- No external CSS libraries or CDN stylesheets
- No emojis in any CSS content values or pseudo-elements

### HTML
- Semantic elements preferred (`<main>`, `<section>`, `<header>`, `<article>`)
- All `<img>` tags must have a descriptive `alt` attribute
- No inline event handlers (`onclick=""` etc.) — all events bound in JavaScript

---

## 5. Naming Conventions

| Thing              | Convention     | Example                    |
|--------------------|----------------|----------------------------|
| JS functions       | `camelCase`    | `sendMessage()`, `exportHistory()` |
| JS variables       | `camelCase`    | `conversationHistory`, `userInput` |
| CSS classes        | `kebab-case`   | `.chat-bubble`, `.user-message` |
| CSS custom props   | `--kebab-case` | `--color-shimmer`, `--gap-md` |
| HTML `id`s         | `kebab-case`   | `#chat-log`, `#send-button` |
| JS files           | `camelCase`    | `chat.js`, `router.js`     |

---

## 6. UI Aesthetic — Gray Galaxy Shiny

The agent must preserve and extend the established visual language. It must not introduce styles that conflict with this direction.

**Palette (CSS custom properties):**
```css
--bg-void:         #0a0a0f;   /* deep space base */
--bg-panel:        rgba(30, 30, 40, 0.75);  /* glass panels */
--color-silver:    #c0c0c0;
--color-white:     #ffffff;
--color-accent:    rgba(200, 200, 220, 0.2); /* border glow */
--shimmer-start:   rgba(255,255,255,0);
--shimmer-mid:     rgba(255,255,255,0.08);
--shimmer-end:     rgba(255,255,255,0);
```

**Mandatory UI rules:**
- Background must remain near-black with animated star field
- Panels use `backdrop-filter: blur()` and dark translucent fills
- Shimmer `@keyframes` animation preserved on interactive elements
- No emojis anywhere — icon needs must be solved with CSS shapes or SVG only
- No bright colour accents (no blue, green, red highlights) — silver/white spectrum only

---

## 7. Feature Boundaries

The agent may only implement the following features:

| Feature                  | Status    |
|--------------------------|-----------|
| Text chat (GPT-4o-mini)  | Required  |
| Image generation         | Required  |
| Intent auto-detection    | Required  |
| Chat history export      | Required  |
| Voice input (Whisper)    | Forbidden |
| Text-to-speech (TTS-1)   | Forbidden |
| User accounts / auth     | Forbidden |
| Backend / database       | Forbidden |
| Any npm package          | Forbidden |

If a user requests a forbidden feature, the agent must explain why it is out of scope for this project and decline to implement it.

---

## 8. Git & Version Control

- The agent must never run `git push` without explicit user confirmation
- The agent must never stage or commit `config.js`
- Before any commit, the agent must verify `.gitignore` includes `config.js`
- Commit messages must follow: `type: short description` (e.g. `feat: add shimmer animation to chat bubbles`)

---

## 9. Prohibited Actions

The agent must never, under any circumstance:

- Install npm packages or modify a `package.json`
- Create or suggest a `node_modules` directory
- Add a framework (React, Vue, Svelte, etc.) — even partially
- Use `eval()` or `Function()` constructor
- Fetch from any domain other than `https://api.openai.com`
- Modify `.gitignore` to include `config.js` in tracked files
- Output or display an API key in any form

---

## 10. Agent Communication Style

- Always state **which file** is being modified and **why** before making changes
- For multi-file changes, list all affected files upfront
- Flag rule violations explicitly: `"This would violate rule [N] — here's an alternative"`
- Keep responses focused — no filler, no unsolicited suggestions