const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import for potential DB connection

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, phone, password, role, aadhaar, expertise } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });
    
    const newUser = new User({ name, email, phone, password, role, aadhaar, expertise });
    await newUser.save();
    
    res.json({ msg: 'User created successfully' });
  } catch (err) {
    console.error('--- Signup Error: ---', err);
    res.status(500).json({ msg: 'Authentication system failure. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userProfile = await User.findOne({ email });

    if (!userProfile) return res.status(404).json({ msg: 'User not registered' });
    if (userProfile.password !== password) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    res.json({ msg: 'Logged in successfully', user: userProfile });
  } catch (err) {
    console.error('--- Login Error: ---', err);
    res.status(500).json({ msg: 'Authentication system failure. Please try again.' });
  }
});

module.exports = router;
