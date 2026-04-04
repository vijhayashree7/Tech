const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const mockDb = require('./mockDb'); // Import our dedicated fail-safe DB

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/service-booking';

// Robust Connection Handshake
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('--- SUCCESS: MongoDB Connected Successfully ---');
    mockDb.setConnected(true);
  })
  .catch(err => {
    console.log('--- WARNING: MongoDB Connection Refused ---');
    console.log('--- ACTION: Switching to Robust MOCK-DB FALLBACK ---');
    mockDb.setConnected(false);
  });

// Routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
