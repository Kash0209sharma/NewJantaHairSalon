const express = require('express');
const Joi = require('joi');
const {
  createAdminToken,
  requireAdmin,
  timingSafeEqualString,
} = require('../utils/adminAuth');

const router = express.Router();

const loginSchema = Joi.object({
  username: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

router.post('/login', (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredUsername || !configuredPassword) {
    return res.status(500).json({
      error: 'Admin authentication is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.',
    });
  }

  const { username, password } = req.body;

  if (!timingSafeEqualString(username, configuredUsername) || !timingSafeEqualString(password, configuredPassword)) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  try {
    const token = createAdminToken();
    res.json({
      message: 'Logged in successfully',
      token,
      admin: { username: configuredUsername },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({
    admin: {
      role: 'admin',
    },
  });
});

module.exports = router;
