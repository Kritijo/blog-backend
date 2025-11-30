const prisma = require("../config/prisma");

exports.getUserPosts = async (req, res) => {
    const id = parseInt(req.user.id);
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const skip = parseInt(req.query.skip) || 0;

        const [userPosts, total] = await Promise.all([
            prisma.post.findMany({
                where: { authorId: id },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.post.count({
                where: { authorId: id },
            }),
        ]);

        res.json({
            userPosts,
            total,
        });
    } catch (err) {
        res.json({
            error: "Cannot get blogs",
        });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = parseInt(req.user.id);
        const thumbnail = req.body.thumbnail || null;

        await prisma.post.create({
            data: {
                title,
                content,
                thumbnail,
                authorId,
            },
        });

        res.status(201).json({ message: "Post created" });
    } catch (error) {
        res.status(500).json({
            error: "Could not create post.",
        });
    }
};

exports.editPost = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);
        const postId = parseInt(req.params.id);
        const { title, content } = req.body;
        const thumbnail = req.body.thumbnail ?? undefined;


        const existingPost = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!existingPost || existingPost.authorId !== userId) {
            return res.status(403).json({
                error: "You are not authorized to edit this post.",
            });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { title, content, thumbnail },
        });

        res.json({
            updatedPost,
        });
    } catch (error) {
        res.status(500).json({
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
                error: "You are not authorized to delete this post.",
            });
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        res.json({
            message: "Post deleted",
        });
    } catch (error) {
        res.status(500).json({
            error: "Could not delete post.",
        });
    }
};
