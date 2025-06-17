const express = require('express');
const { sequelize } = require('./src/models');
require('dotenv').config();

const sequelizeRoutes = require('./src/api/sequelizeRoutes');
const rawRoutes = require('./src/api/rawRoutes');
const fakerBlukCreation = require('./src/faker/bulk-creation');

const app = express();
app.use(express.json());

app.use('/api/sequelize', sequelizeRoutes);
app.use('/api/raw', rawRoutes);
app.use('/api/faker', fakerBlukCreation);

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
});