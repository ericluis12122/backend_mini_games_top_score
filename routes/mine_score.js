const express = require("express");
const Mine = require("../models/Mine");
const router = express.Router();
const authenticateToken = require('../middlewares/auth');

// Get mine scores
router.get("/mine", authenticateToken, async (req, res) => {
    try {
        // Obtén el ID del usuario autenticado desde el token
        const userId = req.user.id;

        // Busca los puntajes y asocia el nombre de usuario desde la referencia
        const scores = await Mine.find().populate("user_id", "username");

        // Devuelve los puntajes y el ID del usuario autenticado
        res.status(200).json({
            scores,
            loggedInUserId: userId, // ID del usuario autenticado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los puntajes" });
    }
});

// Update mine score
router.post("/mine", authenticateToken, async (req, res) => {
    const user_id = req.user.id;
    const {time, count} = req.body;
    if (!time || !count) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
    try {
        let score = await Mine.findOne({ user_id });
        if(!score) {
            console.log("old {time, count}: no registro previo");
            score = new Mine({user_id, time, count});
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