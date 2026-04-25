// router/AIRouter.js
// Clean, slim router — all logic lives in controllers/
const express  = require("express");
const router   = express.Router();
const userAuth = require('../middlewares/auth');

// ── Import Controllers ───────────────────────────────────────────────────────
const { generateFormula, explainFormula }         = require("../controllers/formulaController");
const { chatQuery }                               = require("../controllers/chatController");
const { suggestChartsFromPreview, suggestCharts }  = require("../controllers/chartController");
const { generateReport }                           = require("../controllers/reportController");
const { suggestCleaning, executeCleaning }          = require("../controllers/cleaningController");
const { executeQuery }                             = require("../controllers/transformController");

// ── Formula Routes ───────────────────────────────────────────────────────────
router.post("/generate-formula",          generateFormula);
router.post("/explain-formula",           explainFormula);

// ── Smart Chat Agent (chat + modify + custom formulas) ───────────────────────
router.post("/chat/query",       userAuth, chatQuery);

// ── Chart Suggestions ────────────────────────────────────────────────────────
router.post("/suggest-charts-from-preview", userAuth, suggestChartsFromPreview);
router.post("/suggest-charts",              userAuth, suggestCharts);

// ── Report Generation ────────────────────────────────────────────────────────
router.post("/generate-report",  userAuth, generateReport);

// ── Data Cleaning ────────────────────────────────────────────────────────────
router.post("/suggest-cleaning", userAuth, suggestCleaning);
router.post("/execute-cleaning", userAuth, executeCleaning);

// ── Custom Data Transformation ───────────────────────────────────────────────
router.post("/execute-query",    userAuth, executeQuery);

module.exports = router;