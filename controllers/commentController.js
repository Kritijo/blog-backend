const prisma = require("../config/prisma");

exports.getComments = async (req, res) => {
    const postId = parseInt(req.params.id);

    try {
        const postWithComments = await prisma.post.findUnique({
            where: { id: postId },
            include: { comments: true },
        });

        if (!postWithComments) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json({ comments: postWithComments.comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

exports.postComment = async (req, res) => {
    const postId = parseInt(req.params.id);
    const { name, message } = req.body;

    if (!name || !message) {
        return res
            .status(400)
            .json({ error: "Name and message are required fields." });
    }

    try {
        const postExists = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!postExists) {
            return res.status(404).json({ error: "Post not found." });
        }

        const newComment = await prisma.comment.create({
            data: {
                name,
                message,
                postId,
            },
        });

        res.status(201).json({ comment: newComment });
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ error: "Failed to post comment." });
    }
};
