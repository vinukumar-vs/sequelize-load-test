const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const Customer = sequelize.define('customer', {
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'customer' // <-- Add this option
});

const Driver = sequelize.define('driver', {
  name: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'driver'
});

const Vehicle = sequelize.define('vehicle', {
  model: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'vehicle'
});

const Trip = sequelize.define('trip', {
  start_time: DataTypes.DATE,
  end_time: DataTypes.DATE,
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Driver,
      key: 'id'
    }
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'id'
    }
  }
}, {
  tableName: 'trip'
});

// Reference to Driver model
Trip.belongsTo(Driver, { foreignKey: 'driver_id' });
Driver.hasMany(Trip, { foreignKey: 'driver_id' });

// Reference to Vehicle model
Trip.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
Vehicle.hasMany(Trip, { foreignKey: 'vehicle_id' });

// Reference to Customer model
Trip.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Trip, { foreignKey: 'customer_id' });

// Trip.belongsTo(Customer, { foreignKey: 'customer_id' });
// Trip.belongsTo(Driver, { foreignKey: 'driver_id' });
// Trip.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

module.exports = { sequelize, Customer, Driver, Vehicle, Trip };
