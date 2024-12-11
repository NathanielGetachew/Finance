const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: String,
    default: Date.now(),
  },
  profilePicture: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  deposits: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deposit",
  },
  reports: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
