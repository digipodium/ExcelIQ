// utils/dataUtils.js

// Smart Data Frame Utility
// Replaces danfojs-node with a pure-JS + Arquero pipeline that:
//   1. Trims empty rows  (plain JS filter)
//   2. Trims empty cols  (Arquero select)
//   3. Returns csvData   (70 % token savings vs JSON)
//   4. Returns descObj / missingObj for cleaning analytics

const aq   = require('arquero');
const xlsx = require('xlsx');

/**
 * Read an Excel/CSV file, structurally trim it, and return:
 *   sheetData  – cleaned Array<Object> (row-objects)
 *   csvData    – CSV string ready to embed in AI prompts
 *   descObj    – { colName: { count, mean, std, min, max } } for numeric cols
 *   missingObj – { colName: <missing count> }
 */
const getDataFrame = (filePath) => {
    const workbook  = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    // Read with defval:"" so every cell is always present in the object
    let sheetData = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        { defval: "" }
    );


    // Drop rows where every single value is empty / null / undefined
    sheetData = sheetData.filter(row =>
        Object.values(row).some(v => v !== null && v !== "" && v !== undefined)
    );

    if (sheetData.length === 0) {
        return { sheetData: [], csvData: "", descObj: {}, missingObj: {} };
    }


    // Drop columns where every cell is empty / null / undefined
    let dt = aq.from(sheetData);
    const validCols = dt.columnNames().filter(col => {
        // dt.array() returns a typed/plain JS array — safe to call .some() on
        const arr = Array.from(dt.array(col));
        return arr.some(v => v !== null && v !== "" && v !== undefined);
    });

    if (validCols.length < dt.columnNames().length) {
        dt = dt.select(validCols);
    }

    sheetData = dt.objects();


    // Produces a compact string ~70 % smaller than JSON for the same data
    const trimmedSheet = xlsx.utils.json_to_sheet(sheetData);
    const csvData      = xlsx.utils.sheet_to_csv(trimmedSheet);


    let descObj    = {};
    let missingObj = {};

    Object.keys(sheetData[0]).forEach(key => (missingObj[key] = 0));

    sheetData.forEach(row => {
        Object.keys(missingObj).forEach(key => {
            if (row[key] === null || row[key] === undefined || String(row[key]).trim() === '') {
                missingObj[key]++;
            }
        });
    });

    Object.keys(missingObj).forEach(key => {
        const numericVals = sheetData
            .map(r => r[key])
            .filter(v => typeof v === 'number' && !isNaN(v));

        if (numericVals.length > 0) {
            const count    = numericVals.length;
            const sum      = numericVals.reduce((a, b) => a + b, 0);
            const mean     = sum / count;
            const min      = Math.min(...numericVals);
            const max      = Math.max(...numericVals);
            const variance = numericVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
            const std      = Math.sqrt(variance);
            descObj[key]   = { count, mean, std, min, max };
        }
    });

    return { sheetData, csvData, descObj, missingObj };
};


/**
 * Build a token-efficient AI context string from a csvData string.
 * For small files the full CSV is returned.
 * For large files, head + tail sampling is used (keeps schema + edge patterns).
 *
 * @param {string} csvData   - Full CSV string from getDataFrame
 * @param {number} maxChars  - Total char budget (default 300 000 ≈ ~75k tokens)
 */
const buildAISample = (csvData, maxChars = 300000) => {
    if (!csvData || csvData.length <= maxChars) return csvData;

    // Keep 200k from the start (column headers + early rows)
    // Keep 100k from the end (tail patterns, outliers)
    const head = csvData.substring(0, 200000);
    const tail = csvData.substring(csvData.length - 100000);
    return `${head}\n[... TRUNCATED FOR TOKEN EFFICIENCY ...]\n${tail}`;
};

module.exports = { getDataFrame, buildAISample };
