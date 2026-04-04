const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, required: true },
  problem: { type: String, required: true },
  problemImage: { type: String }, // Store base64 or file path
  deadline: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  providerLocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

module.exports = mongoose.model('Request', RequestSchema);
