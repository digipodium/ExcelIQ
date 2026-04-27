
const { executePrompt }               = require("../utils/gemini.js");
const { getDataFrame, buildAISample } = require("../utils/dataUtils.js");
const fs        = require('fs');
const FileModel = require('../models/fileModel');


const generateReport = async (req, res) => {
    try {
        const { fileId, filePath } = req.body;

        if (!filePath || !fileId) return res.status(400).json({ message: "File path and fileId are required" });

        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server." });

        const fileStat = fs.statSync(filePath);
        const fileSizeMB = fileStat.size / (1024 * 1024);
        if (fileSizeMB > 5) {
            return res.status(400).json({ message: "File exceeds 5 MB limit for report generation. Please use a smaller dataset." });
        }

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
};

module.exports = { generateReport };
