const express = require('express');
const Joi = require('joi');
const Appointment = require('../models/Appointment');
const { requireAdmin } = require('../utils/adminAuth');

const router = express.Router();

// Validation schema - date comes as string from form
const appointmentSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  services: Joi.array().items(Joi.string()).min(1).required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  notes: Joi.string().optional().allow(''),
  status: Joi.string().valid('booked', 'confirmed', 'completed', 'cancelled').optional(),
});

// Get all appointments (admin use)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1, createdAt: 1 });
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
      status: req.body.status || 'booked',
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

// Get available time slots for a date with booked/available status
router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(`${date}T00:00:00`);
    const nextDay = new Date(startOfDay);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayOfWeek = startOfDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    let allTimes = [];
    if (dayOfWeek === 0) {
      // Sunday: 8:00 AM - 2:00 PM, 3:30 PM - 11:00 PM
      allTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:30', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    } else {
      // Monday - Saturday: 9:00 AM - 1:30 PM, 3:30 PM - 10:00 PM
      allTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '13:30', '15:30', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }

    const bookedAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lt: nextDay },
      status: { $ne: 'cancelled' },
    }).select('time name');

    const slots = allTimes.map((time) => {
      const appointment = bookedAppointments.find((item) => item.time === time);
      return {
        time,
        available: !appointment,
        bookedBy: appointment ? appointment.name : null,
      };
    });

    res.json({ slots });
  } catch (err) {
    console.error('Error fetching available times:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
