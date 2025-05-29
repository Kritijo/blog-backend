const { Router } = require("express");
const user = require("../controllers/userController");
const checkToken = require("../middlewares/checkToken");

const userAuth = Router();

userAuth.post("/signin", user.signIn);
userAuth.post("/signup", user.signUp);
userAuth.get("/data", checkToken, user.userData);

module.exports = userAuth;
