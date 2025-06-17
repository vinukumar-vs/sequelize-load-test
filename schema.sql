-- schema.sql
CREATE TABLE customer (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE driver (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE vehicle (
  id SERIAL PRIMARY KEY,
  model VARCHAR(100) NOT NULL
);

CREATE TABLE trip (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customer(id),
  driver_id INT REFERENCES driver(id),
  vehicle_id INT REFERENCES vehicle(id),
  start_time TIMESTAMP,
  end_time TIMESTAMP
);
