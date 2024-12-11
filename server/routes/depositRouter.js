const express = require("express");
const { protect } = require("../middlwares/authMiddleware");
const { makeDeposit, getDeposits } = require("../controllers/despositctrl");
const depositRouter = express.Router();





depositRouter.post("/create", protect,  makeDeposit);
depositRouter.get("/:userId", protect, getDeposits);






module.exports = depositRouter;