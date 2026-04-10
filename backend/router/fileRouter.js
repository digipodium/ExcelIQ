const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const userAuth = require('../middlewares/auth');
const xlsx = require('xlsx'); // To count rows/columns
const FileModel = require('../models/fileModel');

router.post('/upload', userAuth, upload.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  try {
    // 1. Save file record to Database
    await FileModel.create({
       userId: req.user._id,
       fileName: req.file.originalname,
       filePath: req.file.path,
       fileType: req.file.mimetype,
       fileSize: req.file.size
    });

    // 2. Read the file to get Row/Column counts for the Metadata panel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const rowsCount = sheetData.length;
    const columnsCount = sheetData.length > 0 ? Object.keys(sheetData[0]).length : 0;

    const jsonArrayData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" });
    let previewData = { headers: [], rows: [] };
    if (jsonArrayData.length > 0) {
      previewData.headers = jsonArrayData[0];
      previewData.rows = jsonArrayData.slice(1);
    }

    // 3. Send data back exactly as Frontend expects
    res.status(200).json({
      message: "File uploaded successfully",
      path: req.file.path,
      fileMeta: {
        name: req.file.originalname,
        size: (req.file.size / 1024).toFixed(2) + ' KB',
        rows: rowsCount,
        columns: columnsCount
      },
      previewData
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error processing uploaded file" });
  }
});

module.exports = router;
