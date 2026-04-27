
const express = require("express");
const router = express.Router();
const userAuth = require('../middlewares/auth');

const { generateFormula, explainFormula } = require("../controllers/formulaController");
const { chatQuery } = require("../controllers/chatController");
const { suggestChartsFromPreview, suggestCharts } = require("../controllers/chartController");
const { generateReport } = require("../controllers/reportController");
const { suggestCleaning, executeCleaning } = require("../controllers/cleaningController");
const { executeQuery } = require("../controllers/transformController");

router.post("/generate-formula", generateFormula);
router.post("/explain-formula", explainFormula);

router.post("/chat/query", userAuth, chatQuery);

router.post("/suggest-charts-from-preview", userAuth, suggestChartsFromPreview);
router.post("/suggest-charts", userAuth, suggestCharts);

router.post("/generate-report", userAuth, generateReport);

router.post("/suggest-cleaning", userAuth, suggestCleaning);
router.post("/execute-cleaning", userAuth, executeCleaning);

router.post("/execute-query", userAuth, executeQuery);

module.exports = router;