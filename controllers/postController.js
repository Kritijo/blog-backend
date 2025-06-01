const prisma = require("../config/prisma");

exports.getAllPosts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const skip = parseInt(req.query.skip) || 0;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.post.count(),
        ]);

        res.json({ posts, total });
    } catch (error) {
        res.status(500).json({
            error: "Error fetching posts.",
        });
    }
};

exports.getPost = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.json({ post });
    } catch (error) {
        res.status(500).json({
            error: "Error fetching post",
        });
    }
};
