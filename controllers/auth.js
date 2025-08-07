// /controllers/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// Add jsonwebtoken import
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const saltRounds = 12;

// Sign up route
router.post('/sign-up', async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
      return res.status(409).json({err:'Username already taken.'});
    }

    // Create a new user with hashed password
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
    });

    // Construct the payload
    const payload = { username: user.username, _id: user._id };

    // Create the token, attaching the payload
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    // Send the token instead of the user
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Sign in route
router.post('/sign-in', async (req, res) => {
  try {
    // Find the user by username
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (!userInDatabase) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Check if the password is correct
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.hashedPassword);

    if (!validPassword) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Construct the payload
    const payload = { username: userInDatabase.username, _id: userInDatabase._id };

    // Create the token, attaching the payload
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    // Send the token
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

module.exports = router
