const express = require('express');
const Joi = require('joi');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Validation schema - date comes as string from form
const appointmentSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  service: Joi.string().required(),
  date: Joi.string().required(), // Accept as string, convert later
  time: Joi.string().required(),
  notes: Joi.string().optional().allow(''),
});

// Get all appointments (admin use)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    console.error('Validation error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Convert date string to Date object
    const appointmentData = {
      ...req.body,
      date: new Date(req.body.date),
    };

    console.log('Creating appointment:', appointmentData);
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    console.log('Appointment saved successfully:', appointment);
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: 'Failed to book appointment', details: err.message });
  }
});

// Get available time slots (basic implementation)
router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const bookedTimes = await Appointment.find({ date: new Date(date) }).select('time');
    const allTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const availableTimes = allTimes.filter(time => !bookedTimes.some(b => b.time === time));
    res.json(availableTimes);
  } catch (err) {
    console.error('Error fetching available times:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;