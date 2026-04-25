// router/AIRouter.js
// All AI endpoints — uses shared getDataFrame + buildAISample from utils/dataUtils
// for smart trimming, CSV context, and token-efficient prompts.
const express      = require("express");
const router       = express.Router();
const { executePrompt }             = require("../utils/gemini.js");
const { getDataFrame, buildAISample } = require("../utils/dataUtils.js");
const xlsx         = require('xlsx');
const fs           = require('fs');
const HistoryModel = require('../models/historyModel');
const FileModel    = require('../models/fileModel');
const userAuth     = require('../middlewares/auth');

// ── Route: AI Formula Generation ─────────────────────────────────────────────
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

// ── Route: AI Formula Explanation ────────────────────────────────────────────
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

// ── Route: AI Chat Query against Uploaded Dataset ────────────────────────────
router.post("/chat/query", userAuth, async (req, res) => {
    try {
        const { query, file, fileId } = req.body;

        if (!query || !file || !fileId) {
            return res.status(400).json({ message: "Query, file path, and fileId are required" });
        }

        // Ownership check
        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(file)) {
            return res.status(404).json({ message: "File not found on server. Please upload again." });
        }

        const { csvData, sheetData } = getDataFrame(file);
        const sample = buildAISample(csvData);

        const aiPrompt = `
            You are an expert Excel Data Assistant.
            The user has uploaded a dataset. Here is the dataset in CSV format:
            ${sample}
            Total rows in dataset: ${sheetData.length}

            Based strictly on this data, answer the user's question:
            "${query}"

            Keep your answer helpful, concise, and accurate based on the columns provided.
        `;

        const result = await executePrompt(aiPrompt);

        await HistoryModel.create({
            userId:    req.user._id,
            fileId:    fileId || null,
            queryType: 'chat',
            prompt:    query,
            response:  result
        });

        res.status(200).json({ response: result });
    } catch (error) {
        console.error("Chat Query Error:", error);
        res.status(500).json({ message: "AI chat processing failed" });
    }
});

// ── Route: AI Chart Suggestions from Raw Preview Data (no file needed) ───────
router.post("/suggest-charts-from-preview", userAuth, async (req, res) => {
    try {
        const { previewData } = req.body;

        if (!previewData || !Array.isArray(previewData.headers) || !Array.isArray(previewData.rows)) {
            return res.status(400).json({ message: "previewData with headers and rows is required." });
        }
        if (previewData.rows.length === 0) {
            return res.status(200).json({ suggestedCharts: [] });
        }

        // Build a CSV string inline from the preview data
        const headerLine = previewData.headers.join(',');
        const rowLines   = previewData.rows.map(row =>
            row.map(cell => {
                const s = String(cell ?? '');
                // Quote cells that contain commas or quotes
                return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
            }).join(',')
        );
        const csvSample = [headerLine, ...rowLines.slice(0, 50)].join('\n');

        const aiPrompt = `
            You are a Data Visualization Expert.
            The user has provided the following dataset in CSV format (up to 50 rows shown):
            ${csvSample}

            Total rows available: ${previewData.rows.length}
            Columns: ${previewData.headers.join(', ')}

            Analyze the columns and data types carefully to categorize them into Numerical, Categorical, or Timeline columns.
            Suggest 4 to 6 highly relevant, insightful, and diverse chart configurations based on these rules:
            - For CATEGORICAL columns: Suggest 'bar', 'pie', or 'doughnut' charts.
            - For NUMERICAL columns: Suggest 'bar' or 'line' charts.
            - For TIMELINE columns (dates/times): Suggest 'line' or 'bar' charts to show trends over time.

            IMPORTANT RULES:
            - xAxis must be an EXACT match to one of the column names listed above (case-sensitive).
            - yAxis must be an EXACT match to one of the column names listed above (case-sensitive).
            - Choose numeric columns for yAxis.
            - Choose categorical/text or date columns for xAxis.
            - Vary the chart types — do not repeat the same type more than twice.

            Respond STRICTLY with a valid JSON array and NOTHING else (no markdown, no explanation).
            Format:
            [
              {
                "id": 1,
                "title": "Clear Chart Title",
                "type": "bar",
                "xAxis": "ExactColumnName",
                "yAxis": "ExactColumnName",
                "description": "One sentence describing what the chart reveals."
              }
            ]
        `;

        let result = await executePrompt(aiPrompt);

        // Robust JSON extraction
        let jsonStr = result.trim();
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket  = jsonStr.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        let suggestedCharts = [];
        try {
            suggestedCharts = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse AI chart-from-preview response:", result);
            return res.status(200).json({ suggestedCharts: [] });
        }

        res.status(200).json({ suggestedCharts });
    } catch (error) {
        console.error("Chart-from-Preview Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate chart suggestions from preview data." });
    }
});

// ── Route: AI Chart Suggestions (from uploaded file) ─────────────────────────
router.post("/suggest-charts", userAuth, async (req, res) => {
    try {
        const { fileId, filePath } = req.body;

        if (!fileId || !filePath) return res.status(400).json({ message: "File ID and path are required" });

        // Ownership check
        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server." });

        const { csvData, sheetData } = getDataFrame(filePath);

        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ suggestedCharts: [] });
        }

        const sample = buildAISample(csvData);

        const aiPrompt = `
            You are a Data Visualization Expert.
            The user has uploaded a dataset in CSV format:
            ${sample}

            Analyze the columns and data types to identify Categorical, Numerical, and Timeline columns.
            Suggest 3 to 5 highly relevant and insightful charts based on these rules:
            - For CATEGORICAL data: Use 'bar', 'pie', or 'doughnut' charts.
            - For NUMERICAL data: Use 'bar' or 'line' charts.
            - For TIMELINE data (dates): Use 'line' or 'bar' charts to visualize trends.

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

        // Robust JSON extraction
        let jsonStr = result.trim();
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket  = jsonStr.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        let suggestedCharts = [];
        try {
            suggestedCharts = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini chart response:", result);
            return res.status(200).json({ suggestedCharts: [] });
        }

        await FileModel.findByIdAndUpdate(fileId, { $set: { suggestedCharts } });

        res.status(200).json({ suggestedCharts });
    } catch (error) {
        console.error("Chart Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate chart suggestions" });
    }
});

// ── Route: AI Business Report Generation ─────────────────────────────────────
router.post("/generate-report", userAuth, async (req, res) => {
    try {
        const { fileId, filePath } = req.body;

        if (!filePath || !fileId) return res.status(400).json({ message: "File path and fileId are required" });

        // Ownership check
        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server." });

        const { csvData, sheetData } = getDataFrame(filePath);

        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ report: null });
        }

        const sample = buildAISample(csvData);

        const aiPrompt = `
            You are an expert Business Data Analyst.
            The user has uploaded a dataset in CSV format:
            ${sample}
            Total rows: ${sheetData.length}

            Analyze the data and generate a comprehensive professional business report summary.
            Respond STRICTLY with a valid JSON object and NOTHING else (no markdown blocks, no explanation).
            Format the JSON strictly as:
            {
              "title": "A concise, professional title for the report",
              "executiveSummary": "A solid paragraph summarizing the main purpose and high-level view of the dataset",
              "keyFindings": [
                "Finding 1 (e.g. The highest sales were in Q3...)",
                "Finding 2"
              ],
              "trendsAndAnomalies": [
                "Trend/Anomaly 1",
                "Trend/Anomaly 2"
              ],
              "recommendations": [
                "Recommendation 1",
                "Recommendation 2"
              ]
            }
        `;

        let result = await executePrompt(aiPrompt);

        // Robust JSON extraction
        let jsonStr = result.trim();
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace  = jsonStr.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        let reportData = null;
        try {
            reportData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini report response:", result);
            return res.status(500).json({ message: "Failed to parse report generation response" });
        }

        res.status(200).json({ report: reportData });
    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({ message: "Failed to generate report" });
    }
});

// ── Route: AI Data Cleaning Suggestions ──────────────────────────────────────
router.post("/suggest-cleaning", userAuth, async (req, res) => {
    try {
        const { fileId, filePath } = req.body;
        if (!fileId || !filePath) return res.status(400).json({ message: "File ID and path are required" });

        // Ownership check
        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        const { csvData, sheetData, descObj, missingObj } = getDataFrame(filePath);
        if (!sheetData || sheetData.length === 0) return res.status(200).json({ suggestions: [] });

        const sample = buildAISample(csvData);

        const aiPrompt = `
           You are an expert Data Engineer.
           Here are the descriptive statistics: ${JSON.stringify(descObj)}
           Here is the missing-values count per column: ${JSON.stringify(missingObj)}
           Here is the dataset in CSV format (${sheetData.length} total rows):
           ${sample}

           Deeply analyze ALL rows and EVERY column. Provide a comprehensive, exhaustive list of ALL practical data cleaning steps needed.
           Respond STRICTLY with a valid JSON array of strings and NOTHING else.
           Example format: ["Address missing values in column 'Age' by mean imputation.", "Standardize 'Date' column to YYYY-MM-DD."]
        `;

        let result = await executePrompt(aiPrompt);

        // Robust JSON extraction
        let jsonStr = result.trim();
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket  = jsonStr.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        let suggestions = [];
        try {
            suggestions = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Parse error on AI Suggestion:", result);
        }

        res.status(200).json({ suggestions });
    } catch (error) {
        console.error("Cleaning Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate cleaning suggestions" });
    }
});

// ── Route: Execute a Single Cleaning Step (pure JS, no danfojs) ──────────────
router.post("/execute-cleaning", userAuth, async (req, res) => {
    try {
        const { fileId, filePath, suggestion } = req.body;
        if (!fileId || !filePath || !suggestion) return res.status(400).json({ message: "File ID, path, and suggestion are required" });

        // Ownership check
        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        const { sheetData } = getDataFrame(filePath);
        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ success: false, message: "Empty dataset" });
        }

        // Send a 5-row schema sample for context
        const schemaSample = JSON.stringify(sheetData.slice(0, 5));

        const aiPrompt = `
           You are an expert Data Engineer specializing in JavaScript data manipulation.
           The user wants to apply the following data cleaning operation to a JavaScript array of row objects:
           "${suggestion}"

           Here is a structural sample of the first 5 rows to understand the exact column schema:
           ${schemaSample}

           Write a PURE, executable JavaScript function named 'clean' that:
           - Takes exactly one parameter, 'data' (a plain JavaScript Array of row Objects)
           - Applies the requested cleaning operation using ONLY native JavaScript (Array, String, Math, etc.)
           - Returns the modified array

           CRITICALLY: Respond ONLY with the raw JavaScript function block. No markdown, no explanation.
           Just the code:
           function clean(data) {
               // ... pure JS logic here ...
               return data;
           }
        `;

        let rawCode = await executePrompt(aiPrompt);

        // Strip markdown wrappers if AI disobeyed
        let code = rawCode
            .replace(/```javascript/gi, "")
            .replace(/```js/gi, "")
            .replace(/```/g, "")
            .trim();

        // Compile the generated function
        let cleanFn;
        try {
            cleanFn = new Function('data', `${code}\nreturn clean(data);`);
        } catch (compileError) {
            console.error("Function Compilation Failed:", compileError.message);
            return res.status(400).json({ message: "AI generated uncompilable logic. Please try again." });
        }

        // Execute the generated function
        let cleanedData;
        try {
            cleanedData = cleanFn(sheetData);
        } catch (execError) {
            console.error("Function Execution Failed:", execError.message);
            return res.status(400).json({ message: "AI generated logic threw a runtime error. Original data preserved." });
        }

        // ── PROTECTION GUARD (Blueprint Step 6) ────────────────────────────
        // If the function wiped all data, reject it and preserve original
        if (!Array.isArray(cleanedData) || (cleanedData.length === 0 && sheetData.length > 0)) {
            return res.status(400).json({ message: "Cleaning logic failed — would erase all data. Original data preserved." });
        }

        // ── Write cleaned data back to disk ──────────────────────────────────
        try {
            const newSheet    = xlsx.utils.json_to_sheet(cleanedData);
            const newWorkbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
            xlsx.writeFile(newWorkbook, filePath);
        } catch (writeErr) {
            console.error("File Save Failed:", writeErr.message);
            return res.status(500).json({ message: "Failed to save cleaned data to file." });
        }

        // ── Build preview for frontend ────────────────────────────────────────
        let previewData = { headers: [], rows: [] };
        let newMeta     = null;

        if (cleanedData.length > 0) {
            previewData.headers = Object.keys(cleanedData[0]);
            previewData.rows    = cleanedData.map(row => previewData.headers.map(h => row[h]));

            let fileSize      = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
            let formattedSize = fileSize < 1024
                ? `${fileSize} B`
                : fileSize < 1024 * 1024
                    ? `${(fileSize / 1024).toFixed(2)} KB`
                    : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
            let fileName = filePath.split('\\').pop().split('/').pop();

            newMeta = {
                name:    fileName,
                size:    formattedSize,
                rows:    cleanedData.length,
                columns: previewData.headers.length
            };
        }

        res.status(200).json({ success: true, previewData, newMeta });
    } catch (error) {
        console.error("Cleaning Execution Error:", error);
        res.status(500).json({ message: "Failed to execute cleaning step" });
    }
});

module.exports = router;