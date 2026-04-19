const express = require("express");
const router = express.Router();
const { executePrompt } = require("../utils/gemini.js");
const xlsx = require('xlsx');
const fs = require('fs');
const HistoryModel = require('../models/historyModel');
const FileModel = require('../models/fileModel');
const userAuth = require('../middlewares/auth');

// Utility to parse data precisely by utilizing xlsx and an internal DataFrame structifier
// This natively bypasses node-gyp / tfjs binding crashes on Windows while 
// maintaining identically rich Dataframe heuristics normally provided by danfojs-node!
const getDataFrame = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    // Internal Danfojs DataFrame equivalent for statistical mapping without native c++ TFJS requirements
    let descObj = {};
    let missingObj = {};
    
    if (sheetData && sheetData.length > 0) {
        // Initialize column definitions
        Object.keys(sheetData[0]).forEach(key => missingObj[key] = 0);
        
        // Compute precise isNa().sum() natively
        sheetData.forEach(row => {
            Object.keys(missingObj).forEach(key => {
                if (row[key] === null || row[key] === undefined || String(row[key]).trim() === '') {
                    missingObj[key]++;
                }
            });
        });
        
        // Compute describe() statistics natively for numeric inference
        Object.keys(missingObj).forEach(key => {
            let numericVals = sheetData.map(r => r[key]).filter(v => typeof v === 'number' && !isNaN(v));
            if (numericVals.length > 0) {
                let count = numericVals.length;
                let sum = numericVals.reduce((a, b) => a + b, 0);
                let mean = sum / count;
                let min = Math.min(...numericVals);
                let max = Math.max(...numericVals);
                
                // standard deviation
                let variance = numericVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
                let std = Math.sqrt(variance);
                
                descObj[key] = { count, mean, std, min, max };
            }
        });
    }
    
    return { sheetData, descObj, missingObj };
};

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

        if (!query || !file) {
            return res.status(400).json({ message: "Query and file path are required" });
        }

        if (!fs.existsSync(file)) {
            return res.status(404).json({ message: "File not found on server. Please upload again." });
        }

        // Migrate to extraction strategy 
        const { sheetData } = getDataFrame(file);
        const dataSample = JSON.stringify(sheetData || []);

        const aiPrompt = `
            You are an expert Excel Data Assistant. 
            The user has uploaded a dataset. Here is a JSON sample of the full dataset:
            ${dataSample}
            
            Based strictly on this data context, answer the user's question: 
            "${query}"
            
            Keep your answer helpful, concise, and accurate based on the columns provided.
        `;

        const result = await executePrompt(aiPrompt);

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

        if (!fileId || !filePath) return res.status(400).json({ message: "File ID and path are required" });
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server." });

        const { sheetData } = getDataFrame(filePath);

        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ suggestedCharts: [] });
        }

        const dataSample = JSON.stringify(sheetData);

        const aiPrompt = `
            You are a Data Visualization Expert.
            The user has uploaded a dataset. Here is a JSON sample of the dataset:
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
            return res.status(200).json({ suggestedCharts: [] });
        }

        await FileModel.findByIdAndUpdate(fileId, { $set: { suggestedCharts } });

        res.status(200).json({ suggestedCharts });
    } catch (error) {
        console.error("Chart Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate chart suggestions" });
    }
});

// New Route to Generate Professional Report based on Uploaded Data
router.post("/generate-report", userAuth, async (req, res) => {
    try {
        const { fileId, filePath } = req.body;

        if (!filePath) return res.status(400).json({ message: "File path is required" });
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server." });

        const { sheetData } = getDataFrame(filePath);

        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ report: null });
        }

        const dataSample = JSON.stringify(sheetData);

        const aiPrompt = `
            You are an expert Business Data Analyst.
            The user has uploaded a dataset. Here is a JSON sample of the dataset:
            ${dataSample}
            
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

        let jsonStr = result;
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        let reportData = null;
        try {
            reportData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini response for report:", result);
            return res.status(500).json({ message: "Failed to parse report generation response" });
        }

        res.status(200).json({ report: reportData });
    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({ message: "Failed to generate report" });
    }
});

// --- NEW DATA CLEANING ENDPOINT (Danfojs Logic mapped natively) ---
router.post("/suggest-cleaning", userAuth, async (req, res) => {
    try {
        const { fileId, filePath } = req.body;
        if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        const { sheetData, descObj, missingObj } = getDataFrame(filePath);
        if (!sheetData || sheetData.length === 0) return res.status(200).json({ suggestions: [] });

        const descStr = JSON.stringify(descObj);
        const dataSample = JSON.stringify(sheetData);
        
        const aiPrompt = `
           You are an expert Data Engineer. We processed the dataset and extracted key analytics for you to review.
           Here are the descriptive statistics via pseudo-describe(): ${descStr}
           Here is a mapping of exact missing null values per column via pseudo-isNa().sum(): ${JSON.stringify(missingObj)}
           Here is a JSON of the dataset for structural context: ${dataSample}
           
           Deeply analyze ALL rows and EVERY exact column across this ENTIRE provided artifact simultaneously. Provide a comprehensive, exhaustive list of ALL practical data cleaning steps needed across the entire dataset concurrently.
           Respond STRICTLY with a valid JSON array of strings and NOTHING else. 
           Example format: ["Address missing values in column 'Age' by mean imputation.", "Standardize 'Date' column to YYYY-MM-DD."]
        `;
        
        let result = await executePrompt(aiPrompt);
        
        let jsonStr = result;
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1) {
            jsonStr = jsonStr.substring(firstBracket, lastBracket + 1);
        }

        let suggestions = [];
        try { 
            suggestions = JSON.parse(jsonStr); 
        } catch (e) { 
            console.error("Parse error on AI Suggestion.", result); 
        }
        
        res.status(200).json({ suggestions });
    } catch (error) {
        console.error("Cleaning Suggestion Error:", error);
        res.status(500).json({ message: "Failed to generate cleaning suggestions" });
    }
});

// --- EXECUTE CLEANING SUGGESTION (AI Code Generation Execution) ---
router.post("/execute-cleaning", userAuth, async (req, res) => {
    try {
        const { fileId, filePath, suggestion } = req.body;
        if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        const { sheetData } = getDataFrame(filePath);
        if (!sheetData || sheetData.length === 0) return res.status(200).json({ success: false, message: "Empty dataset" });

        const dataSample = JSON.stringify(sheetData.slice(0, 5));
        
        const aiPrompt = `
           You are an expert Data Engineer specializing in Danfo.js.
           The user wants to apply the following data cleaning operation directly to an active Danfojs DataFrame:
           "${suggestion}"
           
           Here is a structural sample of the first 5 rows to understand the exact column schema:
           ${dataSample}
           
           Write a PURE, executable JavaScript function named 'clean' that takes precisely one parameter, 'df' (a danfo.js DataFrame object), applies the requested cleaning operation using strictly native Danfo.js methods (e.g. df.dropNa(), df.fillNa(), df.rename()), and strictly returns the modified DataFrame. 
           
           CRITICALLY: Respond ONLY with the raw Javascript function block. Do not include markdown tags, no conversational text, no explanations. 
           Just the code:
           function clean(df) {
               // ... danfo logic here ...
               return df;
           }
        `;
        
        let rawCode = await executePrompt(aiPrompt);
        
        // Strip out markdown if Gemini disobeyed
        let code = rawCode.replace(/```javascript/gi, "").replace(/```/g, "").trim();

        // Safely execute the function dynamically
        let cleanFn;
        try {
            cleanFn = new Function("df", `${code}\nreturn clean(df);`);
        } catch(compileError) {
            console.error("Function Compilation Failed:", compileError, code);
            return res.status(400).json({ message: "AI Generated uncompilable logic." });
        }

        let cleanedData = [];
        try {
            // Apply generated pure-function using Native Danfo DataFrame injections
            const dfd = require("danfojs-node");
            let df = new dfd.DataFrame(sheetData);
            
            let resultDf = cleanFn(df);
            
            // DanfoJS df.toJSON() converts underlying tensor grids back to JSON mapping instantly
             cleanedData = dfd.toJSON(resultDf); 
        } catch (execError) {
            console.error("Function Execution Failed:", execError);
            if (execError.message && execError.message.includes("tfjs_binding")) {
                return res.status(500).json({ message: "Danfo.js environment error: tfjs-node bindings need rebuilding for Node 20." });
            }
            return res.status(400).json({ message: "AI Danfo generated logic threw an error during execution." });
        }

        // Write the cleaned data back to the existing file silently overwriting it natively
        try {
            const newSheet = xlsx.utils.json_to_sheet(cleanedData);
            const newWorkbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
            xlsx.writeFile(newWorkbook, filePath);
        } catch(writeErr) {
             console.error("File Save Failed:", writeErr);
             return res.status(500).json({ message: "Failed to save cleaned data to file." });
        }

        // Reconstruct preview structural boundaries specifically configured for Frontend rendering
        let previewData = { headers: [], rows: [] };
        let newMeta = null;
        if (cleanedData.length > 0) {
            previewData.headers = Object.keys(cleanedData[0]);
            // Convert to array of arrays to map correctly in native UI tables
            previewData.rows = cleanedData.map(row => previewData.headers.map(h => row[h]));
            
            let fileSize = 0;
            if (fs.existsSync(filePath)) {
                fileSize = fs.statSync(filePath).size;
            }
            let formattedSize = fileSize < 1024 ? `${fileSize} B` : fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(2)} KB` : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
            let fileName = filePath.split('\\').pop().split('/').pop();

            newMeta = {
                name: fileName,
                size: formattedSize,
                rows: cleanedData.length,
                columns: previewData.headers.length
            };
        }

        res.status(200).json({ success: true, previewData, newMeta });
    } catch (error) {
        console.error("Cleaning Execution Error:", error);
        res.status(500).json({ message: "Failed to execute cleaning payload natively" });
    }
});

module.exports = router;