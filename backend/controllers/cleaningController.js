
const { executePrompt }               = require("../utils/gemini.js");
const { getDataFrame, buildAISample } = require("../utils/dataUtils.js");
const xlsx      = require('xlsx');
const fs        = require('fs');
const FileModel = require('../models/fileModel');


const suggestCleaning = async (req, res) => {
    try {
        const { fileId, filePath } = req.body;
        if (!fileId || !filePath) return res.status(400).json({ message: "File ID and path are required" });

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
};


const executeCleaning = async (req, res) => {
    try {
        const { fileId, filePath, suggestion } = req.body;
        if (!fileId || !filePath || !suggestion) return res.status(400).json({ message: "File ID, path, and suggestion are required" });

        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        const { sheetData } = getDataFrame(filePath);
        if (!sheetData || sheetData.length === 0) {
            return res.status(200).json({ success: false, message: "Empty dataset" });
        }

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

        let code = rawCode
            .replace(/```javascript/gi, "")
            .replace(/```js/gi, "")
            .replace(/```/g, "")
            .trim();

        let cleanFn;
        try {
            cleanFn = new Function('data', `${code}\nreturn clean(data);`);
        } catch (compileError) {
            console.error("Function Compilation Failed:", compileError.message);
            return res.status(400).json({ message: "AI generated uncompilable logic. Please try again." });
        }

        let cleanedData;
        try {
            cleanedData = cleanFn(sheetData);
        } catch (execError) {
            console.error("Function Execution Failed:", execError.message);
            return res.status(400).json({ message: "AI generated logic threw a runtime error. Original data preserved." });
        }

        if (!Array.isArray(cleanedData) || (cleanedData.length === 0 && sheetData.length > 0)) {
            return res.status(400).json({ message: "Cleaning logic failed — would erase all data. Original data preserved." });
        }

        try {
            const newSheet    = xlsx.utils.json_to_sheet(cleanedData);
            const newWorkbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
            xlsx.writeFile(newWorkbook, filePath);
        } catch (writeErr) {
            console.error("File Save Failed:", writeErr.message);
            return res.status(500).json({ message: "Failed to save cleaned data to file." });
        }

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
};

module.exports = { suggestCleaning, executeCleaning };
