const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();


// Load 3 API keys from .env
const keys = [
    process.env.GEMINI_API_KEY1,
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY3
].filter(key => key); // Filter out any empty/undefined keys

async function executePrompt(prompt) {
    if (keys.length === 0) {
        console.error("No Gemini API keys found in .env (Please set GEMINI_API_KEY1, GEMINI_API_KEY2, GEMINI_API_KEY3)");
        return null;
    }

    // Loop through the 3 keys
    for (let i = 0; i < keys.length; i++) {
        try {
            console.log(`[AI] Attempting request with Gemini Key ${i + 1}...`);
            const ai = new GoogleGenAI({ apiKey: keys[i] });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    temperature: 0.7,
                },
            });

            console.log("--- AI Response ---");
            // console.log(response.text);

            console.log(`\nUsage: ${response.usageMetadata?.totalTokenCount || 'N/A'} tokens`);
            return response.text;

        } catch (error) {
            console.error(`[AI] Gemini Key ${i + 1} failed:`, error.message);

            // If all keys fail, return null
            if (i === keys.length - 1) {
                console.error("[AI] All 3 Gemini API keys failed due to High Demand. Returning null.");
                return null;
            }
            console.log("[AI] Switching to the next Gemini API key...\n");
        }
    }
}

module.exports = { executePrompt };