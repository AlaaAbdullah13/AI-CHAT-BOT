import { OPENAI_API_KEY } from '../config.js';

/**
 * Sends an image generation prompt to the OpenAI API using gpt-image-1-mini.
 * @param {string} userPrompt - The description of the image to generate
 * @returns {Promise<Object>} The API response containing image URL
 * @throws {Error} If the API call fails or authentication is missing
 */
export async function fetchImageGeneration(userPrompt) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('API Key is missing. Please add your OpenAI key to config.js.');
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-image-1-mini',
            prompt: userPrompt,
            n: 1,
            size: '1024x1024'
        })
    });

    if (!response.ok) {
        let errMsg = `API Error ${response.status}`;
        try {
            const errData = await response.json();
            errMsg = errData.error?.message || errMsg;
        } catch (_) { /* ignore parse error */ }
        throw new Error(errMsg);
    }

    return await response.json();
}
