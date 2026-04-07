const express = require("express");
const router = express.Router();
const { executePrompt } = require("../utils/gemini.js");

// Formula generate karne ke liye route
router.post("/generate-formula", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        // Gemini ko specific instruction dena taaki sirf formula mile
        const aiPrompt = `Act as an Excel Expert. Generate only the Excel formula for this requirement: ${prompt}. Return only the formula text, nothing else.`;
        
        const result = await executePrompt(aiPrompt);
        res.status(200).json({ formula: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI processing failed" });
    }
});

module.exports = router;