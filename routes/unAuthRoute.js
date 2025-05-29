const unAuth = require("express").Router();

const postController = require("../controllers/postController");

unAuth.get("/blog", postController.getAllPosts);
unAuth.get("/blog/:id", postController.getPost);

module.exports = unAuth;
