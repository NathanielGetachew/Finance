const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const User = require("../models/user");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is provided in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

      // Attach user to the request object (to be used in controllers)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If token is not found
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
