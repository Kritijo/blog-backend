const unAuth = require("express").Router();

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

unAuth.get("/blog", postController.getAllPosts);
unAuth.get("/blog/:id", postController.getPost);
unAuth.get("/blog/:id/comments", commentController.getComments);
unAuth.post("/blog/:id/comments", commentController.postComment);

module.exports = unAuth;
