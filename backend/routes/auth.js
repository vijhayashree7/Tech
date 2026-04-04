const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import for potential DB connection
const mockDb = require('../mockDb'); // Import for reliable fallback

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role, aadhaar, expertise } = req.body;
    
    // Explicit selection of DB strategy based on module state
    if (mockDb.isConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ msg: 'User already exists' });
      const newUser = new User({ name, email, phone, password, role, aadhaar, expertise });
      await newUser.save();
    } else {
      // Mock Storage Path - guaranteed to work without Mongoose selection errors
      if (mockDb.users.find(u => u.email === email)) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      mockDb.users.push({ name, email, phone, password, role, aadhaar, expertise, profilePic: '' });
      console.log('--- SAVED TO MOCK-DB: ---', email, 'as', role);
    }
    
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
    let userProfile;

    if (mockDb.isConnected) {
      userProfile = await User.findOne({ email });
    } else {
      userProfile = mockDb.users.find(u => u.email === email);
      console.log('--- LOGIN FROM MOCK-DB: ---', email);
    }

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
