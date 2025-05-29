const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
        res.status(200).json({ success: true, message: "User created!" });
    } catch (err) {
        res.staus(500).json({ success: false, error: "Something went wrong" });
    }
};

exports.signIn = async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
        where: { name: username },
    });

    if (!user) {
        res.staus(500).json({ success: false, error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(500)
            .json({ success: false, error: "Incorrect password" });
    }

    jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
            if (err) {
                res.staus(500).json({
                    success: false,
                    error: err,
                });
            }
            res.status(200).json({
                success: true,
                message: "Log in successful",
                token: token,
            });
        }
    );
};

exports.userData = (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, authorizedData) => {
        if (err) {
            res.status(403).json({
                success: false,
                error: "Could not connect to the protected route",
            });
        } else {
            res.json({
                success: true,
                message: "Authenticated user",
                data: authorizedData,
            });
        }
    });
};
