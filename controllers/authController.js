const prisma = require("../config/prisma");

exports.getUserPosts = async (req, res) => {
    const id = parseInt(req.user.id);
    try {
        const userPosts = await prisma.user.findUnique({
            where: { id },
            include: {
                posts: true,
            },
        });
        res.json({
            success: true,
            data: userPosts.posts,
        });
    } catch (err) {
        res.json({
            success: false,
            error: "Cannot get blogs",
        });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = parseInt(req.user.id);

        await prisma.post.create({
            data: {
                title,
                content,
                authorId,
            },
        });

        res.status(201).json({ success: true, message: "Post created" });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Could not create post.",
        });
    }
};

exports.editPost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const postId = parseInt(req.params.id);
        const { title, content } = req.body;

        const existingPost = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!existingPost || existingPost.authorId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to edit this post.",
            });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { title, content },
        });

        res.json({
            success: true,
            data: updatedPost,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Could not edit post.",
        });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = parseInt(req.user.id);

        const existingPost = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!existingPost || existingPost.authorId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to delete this post.",
            });
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        res.json({
            success: true,
            message: "Post deleted",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Could not delete post.",
        });
    }
};
