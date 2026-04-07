// router/fileRouter.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const userAuth = require('../middlewares/auth');

router.post('/upload', userAuth, upload.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file.filename,
    path: req.file.path
  });
});

module.exports = router;