# GitHub Copilot Instructions

## Project Overview
This is a **client-side AI chatbot** built for a Vibe Coding course project.
It supports text conversation and inline image generation — all from the browser with zero backend.

---

## Stack — Strictly Enforced

| Layer      | Allowed                        | Forbidden                              |
|------------|-------------------------------|----------------------------------------|
| Markup     | Plain HTML5                   | JSX, templating engines                |
| Styling    | Vanilla CSS (in `style.css`)  | Tailwind, Bootstrap, any CSS library   |
| Logic      | Vanilla JavaScript (ES6+)     | React, Vue, Angular, any framework     |
| Modules    | Native ES Modules (`type="module"`) | npm, Webpack, Vite, Babel         |
| Backend    | None — browser → OpenAI only  | Node.js, Express, any server           |

> **Rule:** If it requires `npm install` or a build step, it does not belong in this project.

---

## File Structure

```
/
├── index.html              # App shell — layout and script tags only
├── style.css               # All visual styles (galaxy aesthetic)
├── app.js                  # Entry point — initialises all modules
├── chat.js                 # Text chat logic (GPT-4o-mini)
├── image.js                # Image generation logic (gpt-image-1)
├── history.js              # Chat history export logic
├── router.js               # Intent detection — decides chat vs image
├── config.js               # API key (gitignored — never committed)
├── config.example.js       # Placeholder committed to repo
├── .gitignore              # Ignores config.js
└── .github/
    └── github_copilot_instructions.md
```

> Each file has a **single responsibility**. Do not merge chat, image, and history logic into one file.

---

## API Patterns

### Text Chat — GPT-4o-mini
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: conversationHistory  // full array, not just latest message
  })
});
```

### Image Generation — gpt-image-1
```javascript
const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-image-1',
    prompt: userPrompt,
    n: 1,
    size: '1024x1024'
  })
});
```

### Intent Detection — router.js
`router.js` inspects the user's raw message and returns either `'chat'` or `'image'`.
Trigger image mode on keywords like: `generate`, `draw`, `create`, `show me`, `make a picture`, `image of`.

---

## API Key Handling

- `config.js` exports a single constant: `export const OPENAI_API_KEY = 'sk-...'`
- `config.example.js` exports: `export const OPENAI_API_KEY = 'YOUR_API_KEY_HERE'`
- `.gitignore` must contain `config.js`
- **Copilot must never hardcode an API key anywhere other than `config.js`**
- **Copilot must never suggest committing `config.js`**

---

## UI Aesthetic — Gray Galaxy Shiny

The visual style is **gray galaxy shiny**: deep-space atmosphere with metallic polish.

Key design rules:
- **Background:** Near-black (`#0a0a0f`) with a CSS animated star field (pure CSS or canvas — no images)
- **Panels:** Dark gray glass cards (`rgba(30, 30, 40, 0.75)`) with `backdrop-filter: blur`
- **Accents:** Silver-to-white gradients (`#c0c0c0` → `#ffffff`) for highlights and borders
- **Shimmer effect:** CSS `@keyframes` shimmer on message bubbles and buttons — subtle animated sheen
- **Typography:** System monospace stack (`'Courier New', monospace`) or `'Space Mono'` loaded via Google Fonts
- **Borders:** 1px `rgba(200, 200, 220, 0.2)` with occasional silver glow on focus/hover
- **No emojis anywhere in the UI**
- **No external CSS libraries**

---

## Feature Requirements

### Text Chat
- Maintains a `conversationHistory` array — every message (user + assistant) appended before each API call
- Assistant replies stream or appear as complete blocks — streaming preferred
- Loading state shown while awaiting response

### Image Generation
- Triggered automatically by `router.js` intent detection — no separate button needed
- Generated image rendered inline in the chat thread as `<img>` with descriptive `alt` text
- Show a shimmer placeholder while the image loads

### Chat History Export
- Button in the UI header labeled "Export History"
- Exports the full `conversationHistory` array as a `.json` file via a Blob download
- Images in history are stored as the prompt string, not base64 data

---

## Code Quality Rules

1. Use `async/await` — no `.then()` chains
2. Wrap every API call in `try/catch` — display a user-visible error in the chat on failure
3. No `var` — use `const` and `let` only
4. No inline `style=""` attributes — all styles live in `style.css`
5. DOM queries cached in variables — never query the same element twice
6. Functions named in `camelCase`, CSS classes in `kebab-case`
7. Each function does one thing — max ~20 lines per function
8. No `console.log` left in production code

---

## What Copilot Must NOT Do

- Do not install packages or suggest `npm install`
- Do not create a backend, proxy, or server of any kind
- Do not use `localStorage` to store the API key
- Do not commit or reference `config.js` in any file other than `.gitignore` and the import in `app.js`
- Do not add a framework, even "just for this one component"
- Do not add emojis to the UI
- Do not break the single-responsibility file structure