
const { executePrompt }               = require("../utils/gemini.js");
const { getDataFrame, buildAISample } = require("../utils/dataUtils.js");
const xlsx         = require('xlsx');
const fs           = require('fs');
const HistoryModel = require('../models/historyModel');
const FileModel    = require('../models/fileModel');

const chatQuery = async (req, res) => {
    try {
        const { query, file, fileId } = req.body;

        if (!query || !file || !fileId) {
            return res.status(400).json({ message: "Query, file path, and fileId are required" });
        }


        const fileRecord = await FileModel.findOne({ _id: fileId, userId: req.user._id });
        if (!fileRecord) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this file." });
        }

        if (!fs.existsSync(file)) {
            return res.status(404).json({ message: "File not found on server. Please upload again." });
        }


        const intentPrompt = `
            Analyze the following user query: "${query}"
            Determine if the user wants to JUST ASK A QUESTION about the data (e.g. "what is the average?", "who is the highest?") OR if they want to MODIFY/CHANGE the data (e.g. "change this to that", "delete the row", "add a new column", "make it uppercase").
            Respond STRICTLY with a JSON object and nothing else.
            Format: {"intent": "chat"} OR {"intent": "modify"}
        `;
        let intentResultRaw = await executePrompt(intentPrompt);
        
        let intent = "chat";
        try {
            let jsonStr = intentResultRaw.trim();
            const firstBrace = jsonStr.indexOf('{');
            const lastBrace  = jsonStr.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
            }
            const intentJson = JSON.parse(jsonStr);
            if (intentJson.intent === "modify") intent = "modify";
        } catch(e) {
            console.error("Intent parsing failed, defaulting to chat");
        }

        const { csvData, sheetData } = getDataFrame(file);
        

        if (intent === "chat") {
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

            return res.status(200).json({ response: result, isModified: false });
        } 
        
        else if (intent === "modify") {
            if (!sheetData || sheetData.length === 0) {
                return res.status(200).json({ response: "Dataset is empty. Cannot apply modifications.", isModified: false });
            }

            const schemaSample = JSON.stringify(sheetData.slice(0, 5));
            const columns = Object.keys(sheetData[0]);

            const aiPrompt = `
               You are a Data Transformation Planner.
               The user wants to modify their dataset with this request:
               "${query}"

               Available columns (EXACT names, case-sensitive): ${JSON.stringify(columns)}
               Sample data (first 5 rows): ${schemaSample}
               Total rows: ${sheetData.length}

               Analyze the request and respond STRICTLY with a JSON object describing the operation.
               Choose ONE action type that best matches the request:

               1. RENAME a value:
               {"action": "rename_value", "column": "ExactColumnName", "oldValue": "current value", "newValue": "new value"}

               2. TRANSFORM an entire column (uppercase, lowercase, trim, etc.):
               {"action": "transform_column", "column": "ExactColumnName", "operation": "uppercase|lowercase|trim|capitalize"}

               3. DELETE rows matching a condition:
               {"action": "delete_rows", "column": "ExactColumnName", "condition": "equals|contains|greater_than|less_than", "value": "match value"}

               4. ADD a new row:
               {"action": "add_row", "values": {"Col1": "val1", "Col2": "val2"}}

               5. ADD a new column with a default value:
               {"action": "add_column", "column": "NewColumnName", "defaultValue": "default"}

               6. DELETE a column:
               {"action": "delete_column", "column": "ExactColumnName"}

               7. REPLACE ALL occurrences of a text in a column:
               {"action": "replace_text", "column": "ExactColumnName", "find": "old text", "replace": "new text"}

               8. FILL empty/missing values in a column:
               {"action": "fill_empty", "column": "ExactColumnName", "fillWith": "value to fill"}

               9. SORT data by a column:
               {"action": "sort", "column": "ExactColumnName", "order": "asc|desc"}

               10. UPDATE a specific row by index (1-based row number):
               {"action": "update_row", "rowIndex": 7, "updates": {"Col1": "newVal1", "Col2": "newVal2"}}

               11. SET ALL values in a column to a specific value:
               {"action": "set_all_values", "column": "ExactColumnName", "value": "the new value for every row"}

               12. CUSTOM / ADVANCED operation (use this for ANY request that does NOT fit the above categories):
               This includes: Excel-like formulas (SUM, AVERAGE, VLOOKUP, XLOOKUP, COUNTIF, IF, etc.), creating computed columns, mathematical operations between columns, conditional logic, merging data, or any complex transformation.
               {"action": "custom", "description": "A clear, detailed English description of what needs to be done to the data array"}

               IMPORTANT:
               - Column names MUST exactly match the available columns listed above.
               - For rename_value, use the EXACT current value as it appears in the data (case-sensitive match from sample).
               - If the user says "change all X to Y" or "set all X to Y", use "set_all_values" action.
               - If the user says "change X to Y" (referring to a specific value, not all), use "rename_value" action.
               - If the request involves formulas, calculations, lookups, computed columns, or anything complex, ALWAYS use "custom" action.
               - Respond with ONLY the JSON object. No markdown, no explanation.
            `;

            let aiResult = await executePrompt(aiPrompt);


            let instruction;
            try {
                let jsonStr = aiResult.trim();
                const fb = jsonStr.indexOf('{');
                const lb = jsonStr.lastIndexOf('}');
                if (fb !== -1 && lb !== -1) jsonStr = jsonStr.substring(fb, lb + 1);
                instruction = JSON.parse(jsonStr);
            } catch (e) {
                console.error("AI instruction parse failed:", aiResult);
                return res.status(200).json({ response: "I couldn't understand how to make that change. Please try rephrasing.", isModified: false });
            }


            const aq = require('arquero');
            let tb = aq.from(sheetData);
            let description = "";

            try {
                switch (instruction.action) {
                    case 'rename_value': {
                        const col = instruction.column;
                        const oldVal = instruction.oldValue;
                        const newVal = instruction.newValue;
                        tb = tb.derive({
                            [col]: aq.escape(d => {
                                const cellVal = d[col];
                                if (cellVal == null) return cellVal;
                                return String(cellVal).toLowerCase() === String(oldVal).toLowerCase() ? newVal : cellVal;
                            })
                        });
                        description = `Renamed '${oldVal}' to '${newVal}' in column '${col}'.`;
                        break;
                    }
                    case 'transform_column': {
                        const col = instruction.column;
                        const op = instruction.operation;
                        tb = tb.derive({
                            [col]: aq.escape(d => {
                                const val = d[col];
                                if (val == null) return val;
                                const s = String(val);
                                if (op === 'uppercase') return s.toUpperCase();
                                if (op === 'lowercase') return s.toLowerCase();
                                if (op === 'trim') return s.trim();
                                if (op === 'capitalize') return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                                return val;
                            })
                        });
                        description = `Applied '${op}' transformation to column '${col}'.`;
                        break;
                    }
                    case 'delete_rows': {
                        const col = instruction.column;
                        const cond = instruction.condition;
                        const val = instruction.value;
                        tb = tb.filter(aq.escape(d => {
                            const cellVal = d[col];
                            if (cellVal == null) return true;
                            const s = String(cellVal).toLowerCase();
                            const v = String(val).toLowerCase();
                            if (cond === 'equals') return s !== v;
                            if (cond === 'contains') return !s.includes(v);
                            if (cond === 'greater_than') return Number(cellVal) <= Number(val);
                            if (cond === 'less_than') return Number(cellVal) >= Number(val);
                            return true;
                        }));
                        description = `Deleted rows where '${col}' ${cond} '${val}'.`;
                        break;
                    }
                    case 'add_row': {
                        const newRow = instruction.values || {};
                        const fullRow = {};
                        columns.forEach(c => { fullRow[c] = newRow[c] !== undefined ? newRow[c] : ''; });
                        const newData = [...sheetData, fullRow];
                        tb = aq.from(newData);
                        description = `Added a new row to the dataset.`;
                        break;
                    }
                    case 'add_column': {
                        const colName = instruction.column;
                        const defVal = instruction.defaultValue || '';
                        tb = tb.derive({ [colName]: aq.escape(() => defVal) });
                        description = `Added new column '${colName}' with default value '${defVal}'.`;
                        break;
                    }
                    case 'delete_column': {
                        const colName = instruction.column;
                        const keepCols = columns.filter(c => c !== colName);
                        tb = tb.select(...keepCols);
                        description = `Deleted column '${colName}'.`;
                        break;
                    }
                    case 'replace_text': {
                        const col = instruction.column;
                        const findText = instruction.find;
                        const replaceText = instruction.replace;
                        if (!findText || String(findText).trim() === '') {
                            return res.status(200).json({ response: "Cannot replace with an empty search term. Please specify what text to find and replace.", isModified: false });
                        }
                        tb = tb.derive({
                            [col]: aq.escape(d => {
                                const val = d[col];
                                if (val == null) return val;
                                return String(val).split(findText).join(replaceText);
                            })
                        });
                        description = `Replaced '${findText}' with '${replaceText}' in column '${col}'.`;
                        break;
                    }
                    case 'set_all_values': {
                        const col = instruction.column;
                        const newVal = instruction.value;
                        tb = tb.derive({
                            [col]: aq.escape(() => newVal)
                        });
                        description = `Set all values in column '${col}' to '${newVal}'.`;
                        break;
                    }
                    case 'fill_empty': {
                        const col = instruction.column;
                        const fillVal = instruction.fillWith;
                        tb = tb.derive({
                            [col]: aq.escape(d => {
                                const val = d[col];
                                return (val == null || String(val).trim() === '') ? fillVal : val;
                            })
                        });
                        description = `Filled empty values in column '${col}' with '${fillVal}'.`;
                        break;
                    }
                    case 'sort': {
                        const col = instruction.column;
                        const order = instruction.order === 'desc' ? aq.desc(col) : col;
                        tb = tb.orderby(order);
                        description = `Sorted data by column '${col}' in ${instruction.order === 'desc' ? 'descending' : 'ascending'} order.`;
                        break;
                    }
                    case 'update_row': {
                        const rowIdx = instruction.rowIndex - 1;
                        const updates = instruction.updates || {};
                        const allData = JSON.parse(JSON.stringify(sheetData));
                        if (rowIdx >= 0 && rowIdx < allData.length) {
                            Object.keys(updates).forEach(key => { allData[rowIdx][key] = updates[key]; });
                        }
                        tb = aq.from(allData);
                        description = `Updated row ${instruction.rowIndex} with new values.`;
                        break;
                    }
                    default: {
                        // CUSTOM / ADVANCED: AI-generated Pure JS code execution
                        const customDescription = instruction.description || instruction.action || query;
                        const customPrompt = `
                            You are an expert JavaScript Data Engineer.
                            You have a JavaScript array called 'data' containing row objects.
                            
                            Column names (EXACT): ${JSON.stringify(columns)}
                            Sample data (first 5 rows): ${schemaSample}
                            Total rows: ${sheetData.length}

                            The user wants to: "${customDescription}"
                            Original user query: "${query}"

                            Write a PURE JavaScript function named 'clean' that:
                            - Takes one parameter: 'data' (Array of row Objects)
                            - Applies the requested operation using ONLY native JavaScript
                            - Returns the modified array

                            RULES:
                            1. Use .map(), .filter(), .forEach(), .reduce(), .push() etc.
                            2. For math operations, always convert to Number() first.
                            3. String comparisons should be case-insensitive using .toLowerCase().
                            4. If adding a new column, add the key to every row object.
                            5. If adding a new row, push it to the array with all existing column keys.
                            6. If the user asks for SUM/AVERAGE/COUNT of columns, create a new column with the result for each row.
                            7. For VLOOKUP-like operations: search for a value in one column and return the corresponding value from another column in the same row.
                            8. Always return the full modified array.
                            9. Do NOT use any external libraries.

                            Examples:
                            - "Sum of Column A and Column B as Total":
                              function clean(data) {
                                  return data.map(row => ({ ...row, Total: Number(row['Column A'] || 0) + Number(row['Column B'] || 0) }));
                              }
                            - "Add a row with Name=Rahul, Age=25":
                              function clean(data) {
                                  const newRow = {};
                                  Object.keys(data[0] || {}).forEach(k => newRow[k] = '');
                                  newRow['Name'] = 'Rahul'; newRow['Age'] = 25;
                                  data.push(newRow);
                                  return data;
                              }
                            - "Delete rows where Age > 30":
                              function clean(data) {
                                  return data.filter(row => Number(row['Age']) <= 30);
                              }

                            CRITICALLY: Respond ONLY with the raw JavaScript function. No markdown, no explanation.
                            function clean(data) {
                                // your code here
                                return data;
                            }
                        `;

                        let rawCode = await executePrompt(customPrompt);
                        let code = rawCode.replace(/```javascript/gi, '').replace(/```js/gi, '').replace(/```/g, '').trim();

                        let customFn;
                        try {
                            customFn = new Function('data', `${code}\nreturn clean(data);`);
                        } catch (compileErr) {
                            console.error('Custom code compile error:', compileErr.message);
                            return res.status(200).json({ response: "I couldn't generate valid code for that operation. Please try rephrasing.", isModified: false });
                        }

                        let customResult;
                        try {
                            customResult = customFn(JSON.parse(JSON.stringify(sheetData)));
                        } catch (execErr) {
                            console.error('Custom code execution error:', execErr.message);
                            return res.status(200).json({ response: "An error occurred while executing the operation. Your data is safe.", isModified: false });
                        }

                        if (!Array.isArray(customResult) || (customResult.length === 0 && sheetData.length > 0)) {
                            return res.status(200).json({ response: "That operation would erase all data, so I prevented it.", isModified: false });
                        }

                        tb = aq.from(customResult);
                        description = `Advanced operation completed: ${customDescription}`;
                    }
                }
            } catch (execError) {
                console.error("Arquero Execution Failed:", execError.message);
                return res.status(200).json({ response: "An error occurred while modifying the data. Your original data is safe.", isModified: false });
            }

            const cleanedData = tb.objects();

            if (!Array.isArray(cleanedData) || (cleanedData.length === 0 && sheetData.length > 0)) {
                return res.status(200).json({ response: "That modification would erase all data, so I have safely prevented it.", isModified: false });
            }

            try {
                const newSheet    = xlsx.utils.json_to_sheet(cleanedData);
                const newWorkbook = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
                xlsx.writeFile(newWorkbook, file);
            } catch (writeErr) {
                return res.status(500).json({ message: "Failed to save transformed data to file." });
            }

            let previewData = { headers: [], rows: [] };
            let newMeta     = null;

            if (cleanedData.length > 0) {
                previewData.headers = Object.keys(cleanedData[0]);
                previewData.rows    = cleanedData.map(row => previewData.headers.map(h => row[h]));

                let fileSize      = fs.existsSync(file) ? fs.statSync(file).size : 0;
                let formattedSize = fileSize < 1024
                    ? `${fileSize} B`
                    : fileSize < 1024 * 1024
                        ? `${(fileSize / 1024).toFixed(2)} KB`
                        : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
                let fileName = file.split(/[\\/]/).pop();

                newMeta = {
                    name:    fileName,
                    size:    formattedSize,
                    rows:    cleanedData.length,
                    columns: previewData.headers.length
                };
            }

            const responseMsg = description || "I have successfully updated your dataset as requested.";

            await HistoryModel.create({
                userId:    req.user._id,
                fileId:    fileId || null,
                queryType: 'chat',
                prompt:    query,
                response:  responseMsg
            });

            return res.status(200).json({ 
                response: responseMsg, 
                isModified: true, 
                previewData, 
                newMeta 
            });
        }
    } catch (error) {
        console.error("Chat Query Error:", error);
        res.status(500).json({ message: "AI chat processing failed" });
    }
};

module.exports = { chatQuery };
