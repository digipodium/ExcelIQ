const express = require("express");
const router = express.Router();
const { executePrompt } = require("../utils/gemini.js");
const xlsx = require('xlsx');
const fs = require('fs');
const HistoryModel = require('../models/historyModel');
const FileModel = require('../models/fileModel');
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

// New Route to Suggest Charts based on Uploaded Data
router.post("/suggest-charts", userAuth, async (req, res) => {
    try {
        const { fileId, filePath } = req.body;

        if (!fileId || !filePath) {
            return res.status(400).json({ message: "File ID and path are required" });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server." });
        }

        // Read up to 50 rows
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Check if data is empty
        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ suggestedCharts: [] });
        }

        const dataSample = JSON.stringify(sheetData.slice(0, 50));

        const aiPrompt = `
            You are a Data Visualization Expert.
            The user has uploaded a dataset. Here is a JSON sample of the first 50 rows:
            ${dataSample}
            
            Analyze the columns and data types. Suggest 3 to 5 highly relevant and insightful charts that can be plotted from this data.
            Supported chart types are: 'bar', 'line', 'pie', 'doughnut'.
            
            Respond STRICTLY with a valid JSON array and NOTHING else (no markdown blocks, no explanation).
            Format the JSON strictly as:
            [
              {
                "id": 1,
                "title": "Clear Chart Title",
                "type": "bar",
                "xAxis": "Exact Column Name for horizontal axis",
                "yAxis": "Exact Column Name for vertical axis",
                "description": "Short description of what the chart shows."
              }
            ]
        `;

        let result = await executePrompt(aiPrompt);

        // Clean up possible markdown tags from response by extracting the JSON array part
        let jsonStr = result;
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        let suggestedCharts = [];
        try {
            suggestedCharts = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini response:", result);
            return res.status(200).json({ suggestedCharts: [] }); // return empty array on failure instead of crashing
        }

        // Update DB
        await FileModel.findByIdAndUpdate(fileId, { $set: { suggestedCharts } });

        res.status(200).json({ suggestedCharts });
    } catch (error) {
        console.error("Chart Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate chart suggestions" });
    }
});

module.exports = router;