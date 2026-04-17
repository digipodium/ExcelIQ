const express = require('express');
const router = express.Router();
const fs = require('fs'); // File system access ke liye
const upload = require('../middlewares/upload');
const userAuth = require('../middlewares/auth');
const xlsx = require('xlsx'); // To count rows/columns
const FileModel = require('../models/fileModel');

router.post('/upload', userAuth, upload.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  try {
    // 1. Read the file to get Row/Column counts for the Metadata panel
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

    // 2. Save file record to Database
    const savedFile = await FileModel.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      sheetName: sheetName,
      rowCount: rowsCount,
      columnCount: columnsCount
    });

    // 3. Send data back exactly as Frontend expects
    res.status(200).json({
      message: "File uploaded successfully",
      path: req.file.path,
      fileMeta: {
        id: savedFile._id,
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

// ── 2. NEW: DOWNLOAD API ──
router.get('/download/:id', userAuth, async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileData = await FileModel.findById(fileId);

    if (!fileData) {
      return res.status(404).json({ message: 'File not found in database' });
    }

    const fullPath = fileData.filePath;
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Actual file missing from server' });
    }

    // Yeh browser ko force karega ki file download ho
    res.download(fullPath, fileData.fileName);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

module.exports = router;
