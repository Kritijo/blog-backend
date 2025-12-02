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
        res.json({ message: "User created!" });
    } catch (err) {
        res.staus(500).json({ error: "Something went wrong" });
    }
};

exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return res.json({
            message: "Signed in successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};

exports.signOut = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    res.json({ message: "Logged out" });
};

exports.userData = (req, res) => {
    jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET,
        (err, authorizedData) => {
            if (err) {
                res.status(403).json({
                    error: "Could not connect to the protected route",
                });
            } else {
                res.json({
                    authorizedData,
                });
            }
        }
    );
};
