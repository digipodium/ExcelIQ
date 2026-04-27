// utils/dataUtils.js

// Smart Data Frame Utility
// Replaces danfojs-node with a pure-JS + Arquero pipeline that:
//   1. Auto-detects whether first row is a header or data
//   2. Trims empty rows  (plain JS filter)
//   3. Trims empty cols  (Arquero select)
//   4. Returns csvData   (70 % token savings vs JSON)
//   5. Returns descObj / missingObj for cleaning analytics

const aq   = require('arquero');
const xlsx = require('xlsx');

/**
 * Heuristic to detect if the first row of a 2D array is a header row.
 * Compares text-vs-number pattern of row 1 vs row 2.
 * A header row is typically all/mostly text while data rows contain numbers.
 */
const detectHeader = (rawRows) => {
    if (!rawRows || rawRows.length < 2) return true; // too little data, assume header

    const firstRow  = rawRows[0];
    const secondRow = rawRows[1];
    if (!firstRow || !secondRow) return true;

    const isNumeric = (val) => {
        if (val === null || val === undefined || String(val).trim() === '') return false;
        return !isNaN(Number(val));
    };

    const isText = (val) => {
        if (val === null || val === undefined || String(val).trim() === '') return false;
        return isNaN(Number(val));
    };

    // Count text cells in first row and second row
    const r1TextCount = firstRow.filter(isText).length;
    const r2TextCount = secondRow.filter(isText).length;
    const r1NumCount  = firstRow.filter(isNumeric).length;
    const r2NumCount  = secondRow.filter(isNumeric).length;

    // Case 1: First row is all text, second row has numbers → clearly a header
    if (r1TextCount > 0 && r1NumCount === 0 && r2NumCount > 0) return true;

    // Case 2: First row has more text proportion than second row → likely header
    const r1TextRatio = r1TextCount / firstRow.length;
    const r2TextRatio = r2TextCount / secondRow.length;
    if (r1TextRatio > r2TextRatio && r1TextRatio >= 0.6) return true;

    // Case 3: Both rows have identical type patterns → no header
    if (r1TextCount === r2TextCount && r1NumCount === r2NumCount) return false;

    // Case 4: Check if first row values look like labels (unique strings, no duplicates)
    const r1AllUnique = new Set(firstRow.map(String)).size === firstRow.length;
    if (r1AllUnique && r1TextCount >= firstRow.length * 0.5) return true;

    // Default: assume header (safer for most spreadsheets)
    return true;
};

/**
 * Read an Excel/CSV file, structurally trim it, and return:
 *   sheetData      – cleaned Array<Object> (row-objects)
 *   csvData        – CSV string ready to embed in AI prompts
 *   descObj        – { colName: { count, mean, std, min, max } } for numeric cols
 *   missingObj     – { colName: <missing count> }
 *   hasAutoHeaders – true if headers were auto-generated (file had no header row)
 */
const getDataFrame = (filePath) => {
    const workbook  = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    // Step 1: Read as raw 2D array (no header assumption)
    const rawRows = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        { header: 1, defval: "" }
    );

    // Drop completely empty rows from raw data
    const nonEmptyRows = rawRows.filter(row =>
        row.some(v => v !== null && v !== "" && v !== undefined)
    );

    if (nonEmptyRows.length === 0) {
        return { sheetData: [], csvData: "", descObj: {}, missingObj: {}, hasAutoHeaders: false };
    }

    // Step 2: Detect if first row is a header
    const hasHeader = detectHeader(nonEmptyRows);
    let hasAutoHeaders = false;
    let headers, dataRows;

    if (hasHeader) {
        // First row is header — use it as column names
        headers  = nonEmptyRows[0].map((h, i) => String(h).trim() || `Column_${i + 1}`);
        dataRows = nonEmptyRows.slice(1);
    } else {
        // No header row — auto-generate column names, keep all rows as data
        const colCount = nonEmptyRows[0].length;
        headers  = Array.from({ length: colCount }, (_, i) => `Column_${i + 1}`);
        dataRows = nonEmptyRows;
        hasAutoHeaders = true;
        console.log(`[dataUtils] Auto-generated ${colCount} column headers (no header row detected)`);
    }

    // Handle duplicate column names by appending suffix
    const seen = {};
    headers = headers.map(h => {
        if (seen[h]) {
            seen[h]++;
            return `${h}_${seen[h]}`;
        }
        seen[h] = 1;
        return h;
    });

    // Step 3: Convert to array of objects
    let sheetData = dataRows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = i < row.length ? row[i] : "";
        });
        return obj;
    });

    // Drop rows where every single value is empty / null / undefined
    sheetData = sheetData.filter(row =>
        Object.values(row).some(v => v !== null && v !== "" && v !== undefined)
    );

    if (sheetData.length === 0) {
        return { sheetData: [], csvData: "", descObj: {}, missingObj: {}, hasAutoHeaders };
    }

    // Drop columns where every cell is empty / null / undefined
    let dt = aq.from(sheetData);
    const validCols = dt.columnNames().filter(col => {
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

    return { sheetData, csvData, descObj, missingObj, hasAutoHeaders };
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
