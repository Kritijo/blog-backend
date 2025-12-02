const jwt = require("jsonwebtoken");

const ONE_DAY = 24 * 60 * 60;       

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ error: "No token provided in cookies" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        const now = Math.floor(Date.now()/1000);
        const timeLeft = decoded.exp - now;

        if(timeLeft < ONE_DAY){
            const newToken = jwt.sign(
                {id: decoded.id, name: decoded.name}, 
                process.env.JWT_SECRET, 
                {expiresIn:"7d"}
            );

            res.cookie("token", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 14 * 24 * 60 * 60 * 1000,
            });
        }

        req.user = decoded;
        next();
    });
};
