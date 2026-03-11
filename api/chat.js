import { OPENAI_API_KEY } from '../config.js';

/**
 * Sends a conversation history to the OpenAI Chat API.
 * @param {Array} messages - Full conversation history array [{role, content}]
 * @returns {Promise<Object>} The API response completion
 * @throws {Error} If the API call fails or authentication is missing
 */
export async function fetchChatCompletion(messages) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('API Key is missing. Please check config.js.');
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Chat API Error:', error);
        throw error;
    }
}
