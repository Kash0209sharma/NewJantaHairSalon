const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: [{ type: String, required: true }],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['booked', 'confirmed', 'completed', 'cancelled'],
    default: 'booked',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
