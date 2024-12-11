
const asynchandler = require("express-async-handler");
const Report = require("../models/report");
const Deposit = require("../models/deposit");
const mongoose = require("mongoose");
const calculateInterest = require("../utils/caculateInterest");

exports.generateReport = asynchandler(async (req, res) => {
  const { userId } = req.params;

  // Validate userId format
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400);
    throw new Error("Invalid userId format.");
  }

  try {
    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch all deposits for the user
    const deposits = await Deposit.find({ user: userObjectId });

    if (!deposits || deposits.length === 0) {
      res.status(404);
      throw new Error("No deposits found for this user.");
    }

    // Calculate totals
    let totalDeposits = 0;
    let totalInterest = 0;

    deposits.forEach((deposit) => {
      totalDeposits += deposit.amount;
      totalInterest += calculateInterest(deposit.amount, deposit.frequency);
    });

    const remainingAmount = totalDeposits + totalInterest;

    // Create and save the report
    const report = new Report({
      user: userObjectId,
      totalDeposits,
      totalInterest,
      remainingAmount,
    });

    await report.save();

    res.status(201).json({
      message: "Report generated successfully",
      report,
    });
  } catch (error) {
    console.error("Error generating report:", error.message);
    res.status(500);
    throw new Error("Error generating report: " + error.message);
  }
});


// Get all reports for a user
exports.getReports = asynchandler(async (req, res) => {
  const { userId } = req.params;

  // Validate userId format
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400);
    throw new Error("Invalid userId format.");
  }

  try {
    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch all reports for the user
    const reports = await Report.find({ user: userObjectId });

    if (!reports || reports.length === 0) {
      res.status(404);
      throw new Error("No reports found for this user.");
    }

    res.status(200).json({
      message: "Reports fetched successfully",
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500);
    throw new Error("Error fetching reports: " + error.message);
  }
});



