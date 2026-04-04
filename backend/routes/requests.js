const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const mockDb = require('../mockDb');

// Create a new service request
router.post('/create', async (req, res) => {
  try {
    const { userId, serviceType, problem, problemImage, deadline, timeSlot, phoneNumber, address } = req.body;
    if (mockDb.isConnected) {
      const newRequest = new Request({
        userId, serviceType, problem, problemImage, deadline, timeSlot, phoneNumber, address, status: 'Searching'
      });
      await newRequest.save();
      res.json({ msg: 'Request created successfully', request: newRequest });
    } else {
      const mockRequest = {
        _id: 'mock-' + Date.now().toString(16),
        userId, serviceType, problem, problemImage, deadline, timeSlot, phoneNumber, address, status: 'Searching'
      };
      mockDb.requests.push(mockRequest);
      console.log('--- SAVED TO MOCK-DB (REQUEST): ---', mockRequest._id);
      res.json({ msg: 'Request created successfully (Mock)', request: mockRequest });
    }
  } catch (err) {
    console.error('--- Request Creation Error: ---', err);
    res.status(500).send('Server error');
  }
});

// Update request status (e.g., when a provider accepts)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, lat, lng } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.status = status;
    if (lat && lng) {
      request.providerLocation = { lat, lng };
    }
    await request.save();
    res.json({ msg: 'Request status updated', request });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get a single request by ID (for Status Page)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let request;

    // Check Mock DB first or if it's a mock- prefixed ID
    if (id.startsWith('mock-')) {
      request = mockDb.requests.find(r => r._id === id);
    } else if (mockDb.isConnected) {
      try {
        request = await Request.findById(id);
      } catch (castError) {
        // Fallback to mock search if Mongoose fails finding by string ID
      }
    }

    // Secondary fallback search in mock storage
    if (!request) {
      request = mockDb.requests.find(r => r._id === id);
    }

    if (!request) return res.status(404).json({ msg: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error('--- Get Request Error: ---', err);
    res.status(500).json({ msg: 'Failed to fetch request details' });
  }
});

module.exports = router;
