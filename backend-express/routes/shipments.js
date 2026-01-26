const express = require('express');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// Get shipments
router.get('/', auth, rbac(['ADMIN', 'SELLER']), async (req, res) => {
  // TODO: Implement shipments logic
  res.json({ message: 'Shipments functionality not implemented yet' });
});

// Create shipment
router.post('/', auth, rbac(['ADMIN', 'SELLER']), async (req, res) => {
  // TODO: Implement create shipment
  res.json({ message: 'Create shipment not implemented yet' });
});

// Update shipment status
router.put('/:id/status', auth, rbac(['ADMIN', 'SELLER']), async (req, res) => {
  // TODO: Implement update shipment status
  res.json({ message: 'Update shipment status not implemented yet' });
});

module.exports = router;