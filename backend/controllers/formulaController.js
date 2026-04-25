// controllers/formulaController.js
const { executePrompt } = require("../utils/gemini.js");

// AI Formula Generation
const generateFormula = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: "Prompt is required" });

        const aiPrompt = `
            You are an Excel Expert.
            User Request: "${prompt}"
            Provide ONLY the Excel formula as the output. No explanation, just the formula without any markdown formatting or backticks.
        `;

        const result = await executePrompt(aiPrompt);
        res.status(200).json({ formula: result });
    } catch (error) {
        console.error("Formula Error:", error);
        res.status(500).json({ message: "Error generating formula" });
    }
};

// AI Formula Explanation
const explainFormula = async (req, res) => {
    try {
        const { formula } = req.body;
        if (!formula) return res.status(400).json({ message: "Formula is required" });

        const aiPrompt = `
            You are an Excel Expert.
            Explain how the following Excel formula works step-by-step:
            Formula: "${formula}"

            Keep the explanation clear, concise, and easy for a beginner to understand.
            Provide the explanation in plain text without markdown formatting.
        `;

        const result = await executePrompt(aiPrompt);
        res.status(200).json({ explanation: result });
    } catch (error) {
        console.error("Explanation Error:", error);
        res.status(500).json({ message: "Error generating explanation" });
    }
};

module.exports = { generateFormula, explainFormula };
