const express = require("express");
const { register, login, getProfile } = require("../controllers/usersCtrl");
const { protect } = require("../middlwares/authMiddleware");
const usersRouter = express.Router();



usersRouter.post("/register", register);
usersRouter.post("/login",login);
usersRouter.get("/profile", protect, getProfile);





module.exports = usersRouter;