const prisma = require("../config/prisma");

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error fetching posts.",
        });
    }
};

exports.getPost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const post = await prisma.post.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Error fetching post",
        });
    }
};
