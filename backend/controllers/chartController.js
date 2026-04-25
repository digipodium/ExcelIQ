// controllers/chartController.js
const { executePrompt }               = require("../utils/gemini.js");
const { getDataFrame, buildAISample } = require("../utils/dataUtils.js");
const fs        = require('fs');
const FileModel = require('../models/fileModel');

// Chart Suggestions from Raw Preview Data (no file needed)
const suggestChartsFromPreview = async (req, res) => {
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
};

// Chart Suggestions from uploaded file
const suggestCharts = async (req, res) => {
    try {
        const { fileId, filePath } = req.body;

        if (!fileId || !filePath) return res.status(400).json({ message: "File ID and path are required" });

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
};

module.exports = { suggestChartsFromPreview, suggestCharts };
