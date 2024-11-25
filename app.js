const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require("./config/db");
const authUserRoutes = require("./routes/user_auth");
const pairScoreRoutes = require("./routes/pair_score");
const mineScoreRoutes = require("./routes/mine_score");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", authUserRoutes);
app.use("/", pairScoreRoutes);
app.use("/", mineScoreRoutes);

app.get("/", (req, res) => {
    res.send("¡Hola nodemon!");
});

module.exports = app;