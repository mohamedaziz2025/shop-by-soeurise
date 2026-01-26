const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Health check
router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    },
  };

  const statusCode = health.services.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;