const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { CancellationToken, LEGAL_TLS_SOCKET_OPTIONS } = require("mongodb");
const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const username = email.split('@')[0];
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    console.log(username, email, password, '...registered');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
    console.log(err.message);
  }
});

// Log In
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    console.log(email, password, '...login');
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

module.exports = router;