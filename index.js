const express = require('express');
const { sequelize, Trip, Customer, Driver, Vehicle } = require('./src/models');
const { QueryTypes } = require('sequelize');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const app = express();
app.use(express.json());

// ORM (Sequelize) endpoints
app.post('/api/sequelize/trip', async (req, res) => {
  try {
    const { customer_id, driver_id, vehicle_id, start_time, end_time } = req.body;
    if (
      customer_id === undefined ||
      driver_id === undefined ||
      vehicle_id === undefined ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if referenced records exist
    const [customer, driver, vehicle] = await Promise.all([
      Customer.findByPk(customer_id),
      Driver.findByPk(driver_id),
      Vehicle.findByPk(vehicle_id),
    ]);
    if (!customer) return res.status(400).json({ error: 'Invalid customer_id' });
    if (!driver) return res.status(400).json({ error: 'Invalid driver_id' });
    if (!vehicle) return res.status(400).json({ error: 'Invalid vehicle_id' });

    const trip = await Trip.create({ customer_id, driver_id, vehicle_id, start_time, end_time });
    res.status(201).json(trip);
  } catch (err) {
    console.error('Error creating trip:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/sequelize/trip/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Raw SQL endpoints
app.post('/api/raw/trip', async (req, res) => {
    try {
    const { customer_id, driver_id, vehicle_id, start_time, end_time } = req.body;
    const now = new Date().toISOString();;
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

    // Sequelize.query - Using raw SQL with parameterized queries
//   try {
//     const { customer_id, driver_id, vehicle_id, start_time, end_time } = req.body;
//     const [result] = await sequelize.query(
//       `INSERT INTO trip (customer_id, driver_id, vehicle_id, start_time, end_time)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       {
//         bind: [customer_id, driver_id, vehicle_id, start_time, end_time],
//         type: QueryTypes.INSERT,
//       }
//     );
//     res.status(201).json(result[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
});

app.get('/api/raw/trip/:id', async (req, res) => {
     try {
    const selectQuery = `SELECT * FROM trip WHERE id = $1`;
    const values = [req.params.id];
    const result = await pool.query(selectQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
    // Sequelize.query - Using raw SQL with parameterized queries
//   try {
//     const [result] = await sequelize.query(
//       `SELECT * FROM trip WHERE id = $1`,
//       {
//         bind: [req.params.id],
//         type: QueryTypes.SELECT,
//       }
//     );
//     if (!result) return res.status(404).json({ error: 'Not found' });
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
});

// Sync DB and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
});
