const express = require('express');
const router = express.Router();
const { Trip, Customer, Driver, Vehicle } = require('../models');

router.post('/trip', async (req, res) => {
  try {
    const { customer_id, driver_id, vehicle_id, start_time, end_time } = req.body;
    // Validate required fields
    // If any of these fields are undefined or empty, return a 400 error
    if (
      customer_id === undefined ||
      driver_id === undefined ||
      vehicle_id === undefined ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({ error: 
        `Missing required fields: ${customer_id}, ${driver_id}, ${vehicle_id}, ${start_time}, ${end_time}`
       });
    }
    const [customer, driver, vehicle] = await Promise.all([
      Customer.findByPk(customer_id),
      Driver.findByPk(driver_id),
      Vehicle.findByPk(vehicle_id),
    ]);
    if (!customer) return res.status(400).json({ error: `Invalid customer_id customer - ${customer}` });
    if (!driver) return res.status(400).json({ error: `Invalid driver_id driver - ${driver}` });
    if (!vehicle) return res.status(400).json({ error: `Invalid driver_id vehicle - ${vehicle}` });

    const trip = await Trip.create({ customer_id, driver_id, vehicle_id, start_time, end_time });
    res.status(201).json(trip);
  } catch (err) {
    console.error('Error creating trip:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/trip/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/customer/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/customer', async (req, res) => {
  try {
    // Accept only the 'name' property from req.body
    const { name } = req.body;

    // Basic validation for required field
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    if (!trimmedName) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    // Create customer with only the 'name' property
    const customer = await Customer.create({
      name: trimmedName
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;