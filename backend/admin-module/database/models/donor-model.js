const db = require('../database');

const donor = {
  create: async (data) => {
    const { donor_name, donor_contact, donor_email, donor_address_line1, donor_address_line2, donor_state, donor_city, donor_zipcode, email_opt_in } = data;
    const query = `
      INSERT INTO donor (donor_name, donor_contact, donor_email, donor_address_line1, donor_address_line2, donor_state, donor_city, donor_zipcode, email_opt_in)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [donor_name, donor_contact, donor_email, donor_address_line1, donor_address_line2, donor_state, donor_city, donor_zipcode, email_opt_in];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const query = 'SELECT * FROM donor';
    const result = await db.query(query);
    return result.rows;
  },

  // Add more CRUD operations as needed (update, delete, findOne, etc.)
};

module.exports = donor;