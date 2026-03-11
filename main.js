
import { fetchChatCompletion } from './api/chat.js';
import { fetchImageGeneration } from './api/image.js';
import { detectIntent } from './router.js';
import { exportHistory, saveSessions, loadSessions } from './history.js';

/* =============================================================
   Constants & State
============================================================= */
const DEBUG = false;
const SYSTEM_MESSAGE = {
    role: 'system',
    content: 'You are a "Galaxy Chat" assistant. You can chat and generate images. When a user asks for an image, the system automatically triggers a generation tool. Acknowledge this and do not deny your ability to generate images.'
};

let sessions = loadSessions();           // Array of { id, title, messages[] }
let activeSessionId = null;              // Currently active session
let conversationHistory = [SYSTEM_MESSAGE];

/* =============================================================
   DOM Cache
============================================================= */
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const exportButton = document.getElementById('export-button');
const newChatBtn = document.getElementById('new-chat-btn');
const sessionList = document.getElementById('session-list');
const emptyHistoryMsg = document.getElementById('empty-history-msg');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const welcomeScreen = document.getElementById('welcome-screen');
const sparklesContainer = document.getElementById('sparkles');

/* =============================================================
   Sparkle / Star Generator
============================================================= */
function generateSparkles() {
    const totalStars = 120;
    const crossStars = 30;
    const shootingStarCount = 6;

    // Palette for tinted dot stars
    const starColors = [
        [255, 255, 255],   // white
        [200, 160, 255],   // purple
        [255, 140, 200],   // pink
        [100, 160, 255],   // blue
        [255, 100, 220],   // magenta
        [180, 220, 255],   // ice blue
    ];

    const glyphColors = [
        '#c8a0ff', '#ff80cc', '#80aaff',
        '#ff60b0', '#a0c0ff', '#ffaadd', '#d080ff'
    ];

    // ---- Dot sparkle stars ----
    for (let i = 0; i < totalStars; i++) {
        const star = document.createElement('span');
        star.className = 'star';

        const size = Math.random() * 2.8 + 0.4;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dur = (Math.random() * 5 + 2).toFixed(2);
        const delay = (Math.random() * 8).toFixed(2);
        const maxOp = (Math.random() * 0.65 + 0.3).toFixed(2);

        const [r, g, b] = starColors[Math.floor(Math.random() * starColors.length)];
        const color = `rgba(${r},${g},${b},${maxOp})`;
        const glow = `rgba(${r},${g},${b},0.85)`;
        const glowR = (Math.random() * 3 + 2).toFixed(1);

        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            background: ${color};
            box-shadow: 0 0 ${glowR}px ${glow};
            --dur: ${dur}s;
            --delay: ${delay}s;
            --max-opacity: ${maxOp};
        `;
        sparklesContainer.appendChild(star);
    }

    // ---- Cross / glyph sparkles ----
    const glyphs = ['✦', '✧', '✶', '✸', '✴', '⊹', '+', '×', '✺', '✹'];
    for (let i = 0; i < crossStars; i++) {
        const star = document.createElement('span');
        star.className = 'star cross';
        star.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

        const sizePx = (Math.random() * 12 + 6).toFixed(1) + 'px';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dur = (Math.random() * 6 + 3).toFixed(2);
        const delay = (Math.random() * 10).toFixed(2);
        const maxOp = (Math.random() * 0.55 + 0.35).toFixed(2);
        const color = glyphColors[Math.floor(Math.random() * glyphColors.length)];

        star.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            font-size: ${sizePx};
            color: ${color};
            text-shadow: 0 0 8px ${color}, 0 0 2px #fff;
            --dur: ${dur}s;
            --delay: ${delay}s;
            --max-opacity: ${maxOp};
        `;
        sparklesContainer.appendChild(star);
    }

    // ---- Shooting stars ----
    for (let i = 0; i < shootingStarCount; i++) {
        const s = document.createElement('span');
        s.className = 'shooting-star';
        const top = Math.random() * 55;
        const left = Math.random() * 55;
        const dur = (Math.random() * 1.5 + 1.5).toFixed(2);
        const delay = (Math.random() * 15 + i * 4).toFixed(2);
        s.style.cssText = `
            top: ${top}%;
            left: ${left}%;
            --shoot-dur: ${dur}s;
            --shoot-delay: ${delay}s;
        `;
        sparklesContainer.appendChild(s);
    }
}


/* =============================================================
   Sidebar Toggle
============================================================= */
function openSidebar() {
    sidebar.classList.remove('closed');
    sidebarBackdrop.classList.add('visible');
}

function closeSidebar() {
    sidebar.classList.add('closed');
    sidebarBackdrop.classList.remove('visible');
}

function toggleSidebar() {
    if (sidebar.classList.contains('closed')) {
        openSidebar();
    } else {
        closeSidebar();
    }
}

/* =============================================================
   Session Management
============================================================= */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createSession(firstMessage = '') {
    const id = generateId();
    const title = firstMessage
        ? firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '…' : '')
        : 'New Chat';
    const session = { id, title, messages: [SYSTEM_MESSAGE] };
    sessions.unshift(session);
    saveSessions(sessions);
    return session;
}

function saveCurrentSession() {
    if (!activeSessionId) return;
    const idx = sessions.findIndex(s => s.id === activeSessionId);
    if (idx !== -1) {
        sessions[idx].messages = [...conversationHistory];
        saveSessions(sessions);
    }
}

function loadSession(id) {
    saveCurrentSession();
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    activeSessionId = id;
    conversationHistory = [...session.messages];

    // Render messages
    chatLog.innerHTML = '';
    welcomeScreen.classList.add('hidden');
    const msgs = session.messages.filter(m => m.role !== 'system');
    if (msgs.length === 0) {
        welcomeScreen.classList.remove('hidden');
    } else {
        msgs.forEach(m => renderMessage(m, false, m.imageUrl || null, false));
    }
    renderSessionList();
    scrollToBottom();
}

function startNewChat() {
    saveCurrentSession();
    chatLog.innerHTML = '';
    welcomeScreen.classList.remove('hidden');
    conversationHistory = [SYSTEM_MESSAGE];
    activeSessionId = null;
    renderSessionList();
    userInput.focus();
    // On mobile: close sidebar
    if (window.innerWidth <= 700) closeSidebar();
}

function deleteSession(id, e) {
    e.stopPropagation();
    sessions = sessions.filter(s => s.id !== id);
    saveSessions(sessions);
    if (activeSessionId === id) {
        activeSessionId = null;
        chatLog.innerHTML = '';
        conversationHistory = [SYSTEM_MESSAGE];
        welcomeScreen.classList.remove('hidden');
    }
    renderSessionList();
}

function renderSessionList() {
    // Remove all session items (but keep the empty message)
    const items = sessionList.querySelectorAll('.session-item');
    items.forEach(el => el.remove());

    const realSessions = sessions.filter(s => s.messages.filter(m => m.role !== 'system').length > 0);

    if (realSessions.length === 0) {
        emptyHistoryMsg.style.display = '';
        return;
    }

    emptyHistoryMsg.style.display = 'none';

    realSessions.forEach(session => {
        const item = document.createElement('div');
        item.className = `session-item${session.id === activeSessionId ? ' active' : ''}`;
        item.dataset.id = session.id;

        const icon = document.createElement('span');
        icon.className = 'session-icon';
        icon.textContent = '💬';

        const title = document.createElement('span');
        title.className = 'session-title';
        title.textContent = session.title;

        const del = document.createElement('button');
        del.className = 'session-delete';
        del.title = 'Delete session';
        del.textContent = '✕';
        del.addEventListener('click', (e) => deleteSession(session.id, e));

        item.appendChild(icon);
        item.appendChild(title);
        item.appendChild(del);
        item.addEventListener('click', () => loadSession(session.id));

        sessionList.appendChild(item);
    });
}

/* =============================================================
   Message Handling
============================================================= */
async function handleUserMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = '';

    // Hide welcome screen on first message
    welcomeScreen.classList.add('hidden');

    // Create session if none active
    if (!activeSessionId) {
        const session = createSession(text);
        activeSessionId = session.id;
        conversationHistory = [...session.messages];
        // Update session title with first message
        session.title = text.slice(0, 30) + (text.length > 30 ? '…' : '');
        saveSessions(sessions);
    }

    const userMessage = { role: 'user', content: text };
    conversationHistory.push(userMessage);
    renderMessage(userMessage); // Render FIRST

    setLoadingState(true);      // Then show loading dots

    const intent = detectIntent(text);

    try {
        if (intent === 'image') {
            await processImageIntent(text);
        } else {
            await processChatIntent();
        }
    } catch (error) {
        renderMessage({
            role: 'assistant',
            content: `Error: ${error.message}. Please check your API key and connection.`
        }, true);
    } finally {
        saveCurrentSession();
        renderSessionList();
        setLoadingState(false);
        scrollToBottom();
    }
}

async function processChatIntent() {
    const data = await fetchChatCompletion(conversationHistory);
    const assistantMessage = data.choices[0].message;
    conversationHistory.push(assistantMessage);
    renderMessage(assistantMessage);
}

async function processImageIntent(prompt) {
    const data = await fetchImageGeneration(prompt);

    let imageUrl = data.data?.[0]?.url || data.url;
    const b64Data = data.data?.[0]?.b64_json || data.b64_json;

    if (!imageUrl && b64Data) {
        imageUrl = `data:image/png;base64,${b64Data}`;
    }

    const assistantMessage = {
        role: 'assistant',
        content: imageUrl ? 'Here is your generated image:' : 'Image generation succeeded, but no image data was returned.',
        imagePrompt: prompt,
        imageUrl: imageUrl || null
    };

    if (!imageUrl) console.error('API Response missing image data:', data);

    conversationHistory.push(assistantMessage);
    renderMessage(assistantMessage, !imageUrl, imageUrl);
}

/* =============================================================
   Rendering
============================================================= */
function renderMessage(message, isError = false, imageUrl = null, animate = true) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${message.role}-message${isError ? ' error-message' : ''}`;
    if (!animate) bubble.style.animation = 'none';

    // Label
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = message.role === 'user' ? 'You' : 'Galaxy AI';
    bubble.appendChild(label);

    // Content
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = message.content;
    bubble.appendChild(content);

    // Image
    const imgSrc = imageUrl || message.imageUrl;
    if (imgSrc) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container loading';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = message.imagePrompt || 'Generated AI image';
        img.className = 'generated-image';
        img.onload = () => imgContainer.classList.remove('loading');
        img.onerror = () => {
            imgContainer.classList.remove('loading');
            imgContainer.innerHTML = '<p class="error-text">[ Image Failed to Load ]</p>';
        };

        imgContainer.appendChild(img);
        bubble.appendChild(imgContainer);
    }

    chatLog.appendChild(bubble);
    scrollToBottom();
}

function setLoadingState(isLoading) {
    sendButton.disabled = isLoading;
    userInput.disabled = isLoading;

    if (isLoading) {
        const loader = document.createElement('div');
        loader.id = 'temp-loader';
        loader.className = 'chat-bubble assistant-message loading-shimmer';
        chatLog.appendChild(loader);
    } else {
        document.getElementById('temp-loader')?.remove();
    }
}

function scrollToBottom() {
    const container = document.getElementById('chat-container');
    if (container) container.scrollTop = container.scrollHeight;
}

/* =============================================================
   Chip quick prompts
============================================================= */
function setupChips() {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.dataset.prompt;
            handleUserMessage();
        });
    });
}

/* =============================================================
   Initialisation
============================================================= */
function init() {
    generateSparkles();

    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleUserMessage();
    });

    exportButton.addEventListener('click', () => exportHistory(conversationHistory));
    newChatBtn.addEventListener('click', startNewChat);

    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarBackdrop.addEventListener('click', closeSidebar);

    setupChips();
    renderSessionList();

    if (DEBUG) console.log('Galaxy Chat Initialised. Sessions loaded:', sessions.length);
}

init();
