/**
 * Detects the user's intent from their message.
 * @param {string} message - The raw user input
 * @returns {'chat' | 'image'} - The detected intent
 */
export function detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    const imageKeywords = [
        'generate', 'draw', 'create', 'show me', 'make a picture',
        'image of', 'visualize', 'sketch', 'paint', 'photo'
    ];

    const isImageIntent = imageKeywords.some(keyword => lowerMessage.includes(keyword));

    return isImageIntent ? 'image' : 'chat';
}
