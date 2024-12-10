
const asyncHandler = require("express-async-handler");
const Deposit = require("../models/deposit");

exports.makeDeposit = asyncHandler(async (req, res) => {
  const { amount, frequency } = req.body;

  if (!amount || !frequency) {
    res.status(400);
    throw new Error("Amount and frequency are required");
  }

  const deposit = new Deposit({
    user: req.user._id, // Assuming user is authenticated
    amount,
    frequency,
  });

  await deposit.save();

  res.status(201).json({
    message: "Deposit added successfully",
    deposit,
  });
});





// @desc    Get all deposits for a user
// @route   GET /api/deposits/:userId
// @access  Private
exports.getDeposits = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Extract userId from req.params

  console.log("Fetching deposits for userId:", userId); // Debugging log

  // Fetch all deposits for the user
  const deposits = await Deposit.find({ user: userId }).select("amount date");

  // Check if deposits exist
  if (!deposits.length) {
    return res.status(404).json({ message: "No deposits found for this user" });
  }

  // Send the response
  res.status(200).json(deposits);
});




