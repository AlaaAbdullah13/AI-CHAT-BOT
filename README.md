# 🌌 Galaxy Chat - AI Assistant

Galaxy Chat is a sleek, modern, and immersive AI-powered chat application. Featuring a "Grey Galaxy" aesthetic with smooth CSS animations, it provides a premium interface for interacting with various AI models for both text and image generation.

![Galaxy Chat Preview](https://api.placeholder.com/1200/600?text=%22Grey+Galaxy%22+Chat+Interface)

## ✨ Features

- **🤖 Intelligent Chat**: Powered by OpenAI's `gpt-4o-mini` for fast and smart conversations.
- **🎨 Image Generation**: Integrated DALL-E 3 support for generating high-quality AI images directly in the chat.
- **📝 Session Management**: Automatically saves and manages multiple chat sessions using local storage.
- **🌌 Immersive UI**: Fully responsive "Grey Galaxy" theme featuring:
  - Animated nebula core and spiral swirling effects.
  - CSS-animated sparkles and shooting stars.
  - Frosted glass sidebar for navigation and history.
- **⚡ Fast & Lightweight**: Built with vanilla HTML, CSS, and Modern JavaScript—no heavy frameworks required.
- **🔄 n8n Integration Ready**: Built-in support for webhook-based automation.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **APIs**: OpenAI API (Chat Completions & Images)
- **Persistence**: Browser LocalStorage
- **Animations**: CSS Keyframes & Dynamic JS Particle Generation

## 🚀 Getting Started

### Prerequisites

- An OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Ai-Chat-Bot.git
   cd Ai-Chat-Bot
   ```

2. **Configure your API Key**:
   - Copy `config.example.js` to a new file named `config.js`:
     ```bash
     cp config.example.js config.js
     ```
   - Open `config.js` and paste your OpenAI API Key:
     ```javascript
     export const OPENAI_API_KEY = 'your-key-goes-here';
     ```

3. **Run the application**:
   - Simply open `index.html` in any modern web browser.
   - Or, use a local server like `npx serve`:
     ```bash
     npx serve ./
     ```

## 🔒 Security

- **Local Configuration**: The `config.js` file is included in `.gitignore` by default to prevent your API keys from being leaked to GitHub.
- **Client-Side Note**: This app runs entirely in the browser. For production environments, it is recommended to move API calls to a backend proxy to keep keys fully secured.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Created with ❤️ by [Alaa Abdallah]
