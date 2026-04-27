const express    = require('express');
const router     = express.Router();
const fs         = require('fs');
const upload     = require('../middlewares/upload');
const userAuth   = require('../middlewares/auth');
const xlsx       = require('xlsx');
const FileModel  = require('../models/fileModel');
const HistoryModel = require('../models/historyModel');
const { getDataFrame } = require('../utils/dataUtils');

router.post('/upload', userAuth, upload.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  try {
    const { sheetData } = getDataFrame(req.file.path);
    const rowsCount    = sheetData.length;
    const columnsCount = sheetData.length > 0 ? Object.keys(sheetData[0]).length : 0;

    // Build preview from trimmed data
    let previewData = { headers: [], rows: [] };
    if (sheetData.length > 0) {
      previewData.headers = Object.keys(sheetData[0]);
      previewData.rows    = sheetData.map(row => previewData.headers.map(h => row[h]));
    }


    const savedFile = await FileModel.create({
      userId:      req.user._id,
      fileName:    req.file.originalname,
      filePath:    req.file.path,
      fileType:    req.file.mimetype,
      fileSize:    req.file.size,
      sheetName:   sheetData.length > 0 ? 'Sheet1' : 'Sheet1',
      rowCount:    rowsCount,
      columnCount: columnsCount
    });


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


router.get('/preview/:id', userAuth, async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileData = await FileModel.findOne({ _id: fileId, userId: req.user._id });

    if (!fileData) {
      return res.status(404).json({ message: 'File not found or access denied' });
    }

    const fullPath = fileData.filePath;
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Actual file missing from server' });
    }

    const { sheetData } = getDataFrame(fullPath);
    let previewData = { headers: [], rows: [] };
    if (sheetData.length > 0) {
      previewData.headers = Object.keys(sheetData[0]);
      previewData.rows    = sheetData.map(row => previewData.headers.map(h => row[h]));
    }

    res.status(200).json({ previewData, fileName: fileData.fileName });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ message: 'Error fetching preview', error: error.message });
  }
});


router.get('/download/:id', userAuth, async (req, res) => {
  try {
    const fileId = req.params.id;

    const fileData = await FileModel.findOne({ _id: fileId, userId: req.user._id });

    if (!fileData) {
      return res.status(404).json({ message: 'File not found or access denied' });
    }

    const fullPath = fileData.filePath;
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Actual file missing from server' });
    }

    res.download(fullPath, fileData.fileName);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});


router.get('/list', userAuth, async (req, res) => {
  try {
    const files = await FileModel.find({ userId: req.user._id }).sort({ createdAt: -1 });


    const totalFormulas = await HistoryModel.countDocuments({ userId: req.user._id, queryType: 'formula' });

    const totalCommands = await HistoryModel.countDocuments({ userId: req.user._id, queryType: 'chat' });

    const fileList = files.map(f => ({
      id: f._id,
      name: f.fileName,
      size: f.fileSize < 1024 * 1024
        ? (f.fileSize / 1024).toFixed(2) + ' KB'
        : (f.fileSize / (1024 * 1024)).toFixed(2) + ' MB',
      rows: f.rowCount,
      columns: f.columnCount,
      uploadedAt: f.createdAt,
    }));

    res.status(200).json({ files: fileList, totalFormulas, totalCommands });
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ message: 'Error fetching file list' });
  }
});


router.delete('/delete/:id', userAuth, async (req, res) => {
  try {
    const fileRecord = await FileModel.findOne({ _id: req.params.id, userId: req.user._id });
    if (!fileRecord) return res.status(404).json({ message: 'File not found or access denied' });


    if (fs.existsSync(fileRecord.filePath)) {
      fs.unlinkSync(fileRecord.filePath);
    }


    await HistoryModel.deleteMany({ fileId: fileRecord._id });


    await FileModel.findByIdAndDelete(fileRecord._id);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router;
