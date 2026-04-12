const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ limit: '60mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/service-booking';

// Refined Connection Logic
const startServer = async () => {
  try {
    console.log('--- Connecting to Database... ---');
    await mongoose.connect(MONGO_URI);
    console.log('--- SUCCESS: MongoDB Connected Successfully ---');

    // Routes
    const authRoutes = require('./routes/auth');
    const requestRoutes = require('./routes/requests');

    app.use('/api/auth', authRoutes);
    app.use('/api/requests', requestRoutes);

    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('--- ERROR: MongoDB Connection Refused ---');
    console.error('--- ACTION: Please ensure your MONGO_URI in .env is correct ---');
    console.error(err.message);
    process.exit(1);
  }
};

startServer();
