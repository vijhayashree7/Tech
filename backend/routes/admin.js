const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Request = require('../models/Request');
const Feedback = require('../models/Feedback');
const mockDb = require('../mockDb');

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    if (mockDb.isConnected) {
      const customersCount = await User.countDocuments({ role: 'User' });
      const workersCount = await User.countDocuments({ role: 'ServiceProvider' });
      const bookingsCount = await Request.countDocuments();
      const feedbacksCount = await Feedback.countDocuments();
      const cancelledCount = await Request.countDocuments({ status: 'Cancelled' });
      const activeCount = await Request.countDocuments({ status: { $ne: 'Completed' } });

      return res.json({
        totalCustomers: customersCount,
        totalWorkers: workersCount,
        totalBookings: bookingsCount,
        totalFeedbacks: feedbacksCount,
        cancelledBookings: cancelledCount,
        activeBookings: activeCount
      });
    } else {
      // Mock DB Stats
      return res.json({
        totalCustomers: mockDb.users.filter(u => u.role === 'User').length,
        totalWorkers: mockDb.users.filter(u => u.role === 'ServiceProvider').length,
        totalBookings: mockDb.requests.length,
        totalFeedbacks: mockDb.feedbacks.length,
        cancelledBookings: mockDb.requests.filter(r => r.status === 'Cancelled').length,
        activeBookings: mockDb.requests.filter(r => r.status !== 'Completed').length
      });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch stats' });
  }
});

// Manage Users (Customers)
router.get('/users', async (req, res) => {
  try {
    if (mockDb.isConnected) {
      const users = await User.find({ role: 'User' });
      res.json(users);
    } else {
      res.json(mockDb.users.filter(u => u.role === 'User'));
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

// Manage Workers
router.get('/workers', async (req, res) => {
  try {
    if (mockDb.isConnected) {
      const workers = await User.find({ role: 'ServiceProvider' });
      res.json(workers);
    } else {
      res.json(mockDb.users.filter(u => u.role === 'ServiceProvider'));
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch workers' });
  }
});

// Toggle User Block Status
router.post('/users/toggle-block', async (req, res) => {
  try {
    const { email } = req.body;
    if (mockDb.isConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: 'User not found' });
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ msg: 'User status updated', user });
    } else {
      const user = mockDb.users.find(u => u.email === email);
      if (!user) return res.status(404).json({ msg: 'User not found' });
      user.isBlocked = !user.isBlocked;
      res.json({ msg: 'User status updated (Mock)', user });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Action failed' });
  }
});

// Worker Approval
router.post('/workers/approve', async (req, res) => {
  try {
    const { email, approved } = req.body;
    if (mockDb.isConnected) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: 'Worker not found' });
      user.isApproved = approved;
      await user.save();
      res.json({ msg: 'Worker status updated', user });
    } else {
      const user = mockDb.users.find(u => u.email === email);
      if (!user) return res.status(404).json({ msg: 'Worker not found' });
      user.isApproved = approved;
      res.json({ msg: 'Worker status updated (Mock)', user });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Action failed' });
  }
});

// Manage Bookings
router.get('/bookings', async (req, res) => {
  try {
    if (mockDb.isConnected) {
      const bookings = await Request.find().populate('userId', 'email phone');
      res.json(bookings);
    } else {
      res.json(mockDb.requests);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch bookings' });
  }
});

// Manage Feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    if (mockDb.isConnected) {
      const feedbacks = await Feedback.find().populate('userId', 'email').populate('requestId', 'serviceType');
      res.json(feedbacks);
    } else {
      res.json(mockDb.feedbacks);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch feedbacks' });
  }
});

module.exports = router;
