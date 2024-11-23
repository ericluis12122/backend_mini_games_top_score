const express = require("express");
const Pair = require("../models/Pair");
const router = express.Router();
const authenticateToken = require('../middlewares/auth');

// Get pair scores
router.get("/pair", authenticateToken, async (req, res) => {
    try {
        const scores = await Pair.find().populate("user_id", "username");
        const formattedScores = scores.map(score => ({
            username: score.user_id.username,
            time: score.time,
            count: score.count
        }));
        res.status(200).json(formattedScores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los puntajes" });
    }
});

// Update pair score
router.post("/pair", authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    const {time, count} = req.body;
    if (!time || !count) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    try {
        let score = await Pair.findOne({ user_id });
        if(!score) {
            console.log("old {time, count}: no registro previo");
            score = new Pair({user_id, time, count});
            await score.save();
            res.status(201).json({ message: "Good job!" });
        }
        else if (time < score.time || count < score.count) {
            console.log("old {time, count}:", score.time, score.count);
            score.time = Math.min(time, score.time); // Tomar el menor valor de `time`
            score.count = Math.min(count, score.count); // Tomar el menor valor de `count`
            await score.save();
            res.status(201).json({ message: "new personal score" });
        }
        else {
            res.status(201).json({ message: "Good try!" });
        }
        console.log("current {time, count}:", score.time, score.count);
        
    } catch (error) {
        res.status(500).json({ error: "Error registering pair score" });
        console.log(err.message);
    }
});

module.exports = router;