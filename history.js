const SESSIONS_KEY = 'galaxy_chat_sessions';

/**
 * Save sessions array to localStorage.
 * @param {Array} sessions
 */
export function saveSessions(sessions) {
    try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) {
        console.warn('Could not save sessions:', e);
    }
}

/**
 * Load sessions array from localStorage.
 * @returns {Array} sessions
 */
export function loadSessions() {
    try {
        const raw = localStorage.getItem(SESSIONS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn('Could not load sessions:', e);
        return [];
    }
}

/**
 * Export the current conversation history as a JSON file download.
 * @param {Array} history
 */
export function exportHistory(history) {
    if (!history || history.length <= 1) {
        alert('No chat history to export yet.');
        return;
    }

    try {
        const jsonContent = JSON.stringify(history, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `galaxy-chat-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export history.');
    }
}
