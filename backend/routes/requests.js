const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Get all service requests (for Partner Hub)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('--- Get All Requests Error: ---', err);
    res.status(500).json({ msg: 'Failed to fetch request list' });
  }
});

// Create a new service request
router.post('/create', async (req, res) => {
  try {
    const { userId, serviceType, problem, problemImage, deadline, timeSlot, phoneNumber, address, customerLocation } = req.body;
    
    const newRequest = new Request({
      userId, serviceType, problem, problemImage, deadline, timeSlot, phoneNumber, address, customerLocation, status: 'Searching'
    });
    await newRequest.save();
    
    res.json({ msg: 'Request created successfully', request: newRequest });
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
    
    const request = await Request.findById(id);

    if (!request) return res.status(404).json({ msg: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error('--- Get Request Error: ---', err);
    res.status(500).json({ msg: 'Failed to fetch request details' });
  }
});

module.exports = router;
