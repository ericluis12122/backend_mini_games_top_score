const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authUserRoutes = require("./routes/user_auth");
const pairScoreRoutes = require("./routes/pair_score");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/", authUserRoutes);
app.use("/", pairScoreRoutes);

app.get("/", (req, res) => {
    res.send("¡Hola nodemon!");
});

module.exports = app;