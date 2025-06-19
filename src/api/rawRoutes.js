const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

router.post('/trip', async (req, res) => {
  try {
    const { customer_id, driver_id, vehicle_id, start_time, end_time } = req.body;
    const now = new Date().toISOString();
    const insertQuery = `
      INSERT INTO trip (customer_id, driver_id, vehicle_id, start_time, end_time, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [customer_id, driver_id, vehicle_id, start_time, end_time, now, now];
    const result = await pool.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trip/:id', async (req, res) => {
  try {
    const selectQuery = `SELECT trip.id AS trip_id, customer.id AS customer_id, customer.name AS customer_name, driver.id AS driver_id, driver.name AS driver_name, vehicle.id AS vehicle_id, vehicle.model AS vehicle_model, trip.start_time, trip.end_time FROM trip JOIN customer ON trip.customer_id = customer.id JOIN driver ON trip.driver_id = driver.id JOIN vehicle ON trip.vehicle_id = vehicle.id WHERE trip.id = $1`;
    const values = [req.params.id];
    const result = await pool.query(selectQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customer/:id', async (req, res) => {
  try {
   const selectQuery = `SELECT * FROM customer WHERE id = $1`;
    const values = [req.params.id];
    const result = await pool.query(selectQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.rows[0]);
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

    // Insert customer using raw SQL query
    const now = new Date().toISOString();
    const insertQuery = `
      INSERT INTO customer (name, "createdAt", "updatedAt")
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [trimmedName, now, now];
    const result = await pool.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;