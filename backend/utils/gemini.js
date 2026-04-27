const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY, 
});

async function executePrompt(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            },
        });

        console.log("--- AI Response ---");
        console.log(response.text);

        console.log(`\nUsage: ${response.usageMetadata.totalTokenCount} tokens`);
        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
    }
}

module.exports = { executePrompt };