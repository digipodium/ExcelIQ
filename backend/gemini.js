const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

// 1. Initialize the client
// Ensure GEMINI_API_KEY is set in your .env file
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
    try {
        // 2. Make the request
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Use the latest 2026 preview model
            contents: "Explain the concept of quantum entanglement to a five-year-old.",
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

    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
    }
}

run();