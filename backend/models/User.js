const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  role: { type: String, enum: ['User', 'ServiceProvider', 'Admin'], default: 'User' },
  aadhaar: { type: String },
  expertise: { type: String },
  address: { type: String, default: '' },
  isBlocked: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }, // For service providers
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
});

module.exports = mongoose.model('User', UserSchema);
