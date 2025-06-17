const express = require('express');
const router = express.Router();
const { Customer, Driver, Vehicle } = require('../models');
const { faker } = require('@faker-js/faker');

// Bulk insert customers
router.post('/customer/bulk', async (req, res) => {
  try {
    const count = Number(req.body.count) || 100;
    const customers = Array.from({ length: count }, () => ({
      name: faker.person.fullName(),
    }));
    const result = await Customer.bulkCreate(customers, { returning: true });
    res.status(201).json({ inserted: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk insert drivers
router.post('/driver/bulk', async (req, res) => {
  try {
    const count = Number(req.body.count) || 100;
    const drivers = Array.from({ length: count }, () => ({
      name: faker.person.fullName(),
    }));
    const result = await Driver.bulkCreate(drivers, { returning: true });
    res.status(201).json({ inserted: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk insert vehicles
router.post('/vehicle/bulk', async (req, res) => {
  try {
    const count = Number(req.body.count) || 100;
    const vehicles = Array.from({ length: count }, () => ({
      model: faker.vehicle.model(),
    }));
    const result = await Vehicle.bulkCreate(vehicles, { returning: true });
    res.status(201).json({ inserted: result.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;