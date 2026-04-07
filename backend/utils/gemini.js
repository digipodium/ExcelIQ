const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

// 1. Initialize the client
// Ensure GEMINI_API_KEY is set in your .env file
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function executePrompt(prompt) {
    try {
        // 2. Make the request
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Use the latest 2026 preview model
            contents: prompt,
            config: {
                // Gemini 3 exclusive: Set reasoning depth (minimal, low, medium, high)
                temperature: 0.7,
            },
        });

        // 3. Log the result
        console.log("--- AI Response ---");
        console.log(response.text);

        // Check token usage if needed
        console.log(`\nUsage: ${response.usageMetadata.totalTokenCount} tokens`);
        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
    }
}

module.exports = { executePrompt };