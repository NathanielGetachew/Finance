const asynchandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require('bcrypt'); 
const jwt = require("jsonwebtoken");


//@desc Register a new user
//@route POST /api/v1/users/register
//@access Public

exports.register = asynchandler(async (req, res) => {
    //get the details
    const { firstName,lastName, password, email } = req.body;
    // check if the user exists already
    const user = await User.findOne({ email});
    if (user) {
      throw new Error("User already Exists");
    }
    // Register the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    // hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    newUser.password = await bcrypt.hash(newUser.password, salt);
  
    // save the user to database
    await newUser.save();
    res.status(201).json({
      status: "successful",
      message: "User Rgistered Successfully",
      
      newUser,
    });
  });

  // login a registered user
//@route POST /api/v1/users/login
//@access Public



exports.login = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid login credentials");
  }

  // Compare the hashed password
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new Error("Invalid login credentials");
  }

  // Update the last login time
  user.lastLogin = new Date();
  await user.save();

  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id }, // Payload
    process.env.JWTPRIVATEKEY, // Secret key
    { expiresIn: "30d" } // Token expiration
  );

  res.json({
    status: "Success",
    token, 
    firstName: user.firstName,
    email: user.email,
    _id: user._id,
    profilePicture: user.profilePicture,
  });
});

// Get user profile
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Protected by JWT)
exports.getProfile = asynchandler(async (req, res) => {
  // Fetch user from the database using the user id from the JWT token
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});
  
