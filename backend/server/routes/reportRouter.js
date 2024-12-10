const express = require("express");
const { protect } = require("../middlwares/authMiddleware");
const { generateReport, getReports,  } = require("../controllers/reportsCtrl");

const reportRouter = express.Router();

// Generate report
reportRouter.get("/:userId",protect, generateReport );

reportRouter.get("/getreports/:userId",protect, getReports);

module.exports = reportRouter;
