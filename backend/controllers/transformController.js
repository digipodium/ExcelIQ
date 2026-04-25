// controllers/transformController.js
const { executePrompt }   = require("../utils/gemini.js");
const { getDataFrame }    = require("../utils/dataUtils.js");
const xlsx      = require('xlsx');
const fs        = require('fs');
const FileModel = require('../models/fileModel');

// Execute Custom User Query using Arquero JS
const executeQuery = async (req, res) => {
    try {
        const { fileId, filePath, query } = req.body;
        if (!fileId || !filePath || !query) return res.status(400).json({ message: "File ID, path, and query are required" });

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
           You are an expert Data Engineer specializing in Arquero JS (Apache Arrow data manipulation).
           The user wants to modify their data with the following request:
           "${query}"

           Here is a structural sample of the first 5 rows to understand the column schema:
           ${schemaSample}

           Write a PURE, executable JavaScript function named 'transform' that:
           - Takes two parameters: 'aq' (the arquero library object) and 'data' (a plain JavaScript Array of row Objects)
           - Converts the data to an arquero table using: let tb = aq.from(data);
           - Applies the user's requested transformation using Arquero functions (e.g., tb.derive, tb.filter, tb.select).
           - Returns the modified table back as a JavaScript array: return tb.objects();

           CRITICALLY: Respond ONLY with the raw JavaScript function block. No markdown, no explanation.
           Just the code:
           function transform(aq, data) {
               let tb = aq.from(data);
               // ... Arquero logic here ...
               return tb.objects();
           }
        `;

        let rawCode = await executePrompt(aiPrompt);

        let code = rawCode
            .replace(/```javascript/gi, "")
            .replace(/```js/gi, "")
            .replace(/```/g, "")
            .trim();

        const aq = require('arquero');

        let transformFn;
        try {
            transformFn = new Function('aq', 'data', `${code}\nreturn transform(aq, data);`);
        } catch (compileError) {
            console.error("Function Compilation Failed:", compileError.message);
            return res.status(400).json({ message: "AI generated uncompilable logic. Please try again." });
        }

        let cleanedData;
        try {
            cleanedData = transformFn(aq, sheetData);
        } catch (execError) {
            console.error("Function Execution Failed:", execError.message);
            return res.status(400).json({ message: "AI generated logic threw a runtime error. Original data preserved." });
        }

        if (!Array.isArray(cleanedData) || (cleanedData.length === 0 && sheetData.length > 0)) {
            return res.status(400).json({ message: "Transformation logic failed — would erase all data. Original data preserved." });
        }

        try {
            const newSheet    = xlsx.utils.json_to_sheet(cleanedData);
            const newWorkbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
            xlsx.writeFile(newWorkbook, filePath);
        } catch (writeErr) {
            console.error("File Save Failed:", writeErr.message);
            return res.status(500).json({ message: "Failed to save transformed data to file." });
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
        console.error("Transformation Execution Error:", error);
        res.status(500).json({ message: "Failed to execute custom data transformation" });
    }
};

module.exports = { executeQuery };
