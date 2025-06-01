require("dotenv");
const cors = require("cors");

const express = require("express");
const auth = require("./routes/authRoute");
const unAuth = require("./routes/unAuthRoute");
const userAuth = require("./routes/userRoute");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.REACT_APP,
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/blog", auth);
app.use("/api/v1/home", unAuth);
app.use("/api/v1/user", userAuth);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
