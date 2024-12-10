const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;
