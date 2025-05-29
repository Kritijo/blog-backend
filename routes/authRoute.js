const { Router } = require("express");
const auth = Router();
const checkToken = require("../middlewares/checkToken");
const authenticated = require("../controllers/authController");

auth.get("/", checkToken, authenticated.getUserPosts);
auth.post("/", checkToken, authenticated.createPost);
auth.put("/:id", checkToken, authenticated.editPost);
auth.delete("/:id", checkToken, authenticated.deletePost);

module.exports = auth;
