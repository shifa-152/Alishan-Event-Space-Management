// backend/routes/adminAuth.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // read credentials from env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({ message: 'Admin credentials not configured' });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin', email }, jwtSecret, { expiresIn: '6h' });

  res.json({ token, message: 'Login success' });
});

module.exports = router;
