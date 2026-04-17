const express = require("express");
const router = express.Router();
const { executePrompt } = require("../utils/gemini.js");
const xlsx = require('xlsx'); // <-- Import the new library
const fs = require('fs');
const HistoryModel = require('../models/historyModel');
const userAuth = require('../middlewares/auth');

// Route for AI Formula Generation
router.post("/generate-formula", async (req, res) => {
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
});

// Route for AI Formula Explanation
router.post("/explain-formula", async (req, res) => {
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
});

// New Route for AI Chat Queries based on Uploaded Data
router.post("/chat/query", userAuth, async (req, res) => {
    try {
        const { query, file, fileId } = req.body; 
        // Note: 'file' here MUST be the 'path' (e.g., 'uploads/excelFile-123.xlsx')
        
        if (!query || !file) {
            return res.status(400).json({ message: "Query and file path are required" });
        }

        // 1. Check if file exists on the server
        if (!fs.existsSync(file)) {
            return res.status(404).json({ message: "File not found on server. Please upload again." });
        }

        // 2. Read the Excel/CSV file
        const workbook = xlsx.readFile(file);
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // 3. Prevent Token Overload
        // AI models have limits. We send the first 50 rows so Gemini understands the structure and data.
        const dataSample = JSON.stringify(sheetData); 

        // 4. Construct the Prompt with the actual data
        const aiPrompt = `
            You are an expert Excel Data Assistant. 
            The user has uploaded a dataset. Here is a JSON sample of the first 50 rows:
            ${dataSample}
            
            Based strictly on this data context, answer the user's question: 
            "${query}"
            
            Keep your answer helpful, concise, and accurate based on the columns provided.
        `;
        
        // 5. Send to Gemini
        const result = await executePrompt(aiPrompt);
        
        // Save chat query history to DB
        await HistoryModel.create({
            userId: req.user._id,
            fileId: fileId || null,
            queryType: 'chat',
            prompt: query,
            response: result
        });
        
        res.status(200).json({ response: result });
    } catch (error) {
        console.error("Chat Query Error:", error);
        res.status(500).json({ message: "AI chat processing failed" });
    }
});

module.exports = router;