const axios = require('axios');
const { faker } = require('@faker-js/faker');

async function insertCustomers(count = 100) {
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    try {
      const res = await axios.post('http://localhost:3000/api/customer', { name });
      console.log(`Inserted customer: ${res.data.name}`);
    } catch (err) {
      console.error('Insert failed:', err.response?.data || err.message);
    }
  }
}

insertCustomers();
