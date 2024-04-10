const db = require('../database');

const admin = {
  create: async (data) => {
    const { admin_name, admin_email, admin_address_line1, admin_address_line2, admin_state, admin_city, admin_zipcode, admin_contact } = data;
    const query = `
      INSERT INTO admin (admin_name, admin_email, admin_address_line1, admin_address_line2, admin_state, admin_city, admin_zipcode, admin_contact)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [admin_name, admin_email, admin_address_line1, admin_address_line2, admin_state, admin_city, admin_zipcode, admin_contact];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const query = 'SELECT * FROM admin';
    const result = await db.query(query);
    return result.rows;
  },

  // Add more CRUD operations as needed (update, delete, etc.)
};

module.exports = admin;