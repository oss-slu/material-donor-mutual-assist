const db = require('../database');

const donor = {
  create: async (data) => {
    const { donor_firstName, donor_lastName, donor_contact, donor_email, donor_address_line1, donor_address_line2, donor_state, donor_city, donor_zipcode, email_opt_in } = data;
    const query = `
      INSERT INTO donor (donor_firstName, donor_lastName, donor_contact, donor_email, donor_address_line1, donor_address_line2, donor_state, donor_city, donor_zipcode, email_opt_in)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [donor_firstName, donor_lastName, donor_contact, donor_email, donor_address_line1, donor_address_line2, donor_state, donor_city, donor_zipcode, email_opt_in];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  findAll: async () => {
    const query = 'SELECT * FROM donor';
    const result = await db.query(query);
    return result.rows;
  },
  findOneById: async (donorId) => {
    const query = 'SELECT * FROM donor WHERE donor_id = $1';
    const values = [donorId];
    const result = await db.query(query, values);
    return result.rows[0] || null; // Return null if no donor found
  },

  update: async (donorId, data) => {
    const {
      donor_firstName,
      donor_lastName,
      donor_contact,
      donor_email,
      donor_address_line1,
      donor_address_line2,
      donor_state,
      donor_city,
      donor_zipcode,
      email_opt_in,
    } = data;
  
    const updateValues = [];
    let updateString = '';
  
    if (donor_firstName) {
      updateValues.push(donor_firstName);
      updateString += 'donor_firstName = $' + updateValues.length + ', ';
    }

    if (donor_lastName) {
      updateValues.push(donor_lastName);
      updateString += 'donor_lastName = $' + updateValues.length + ', ';
    }
  
    if (donor_contact) {
      updateValues.push(donor_contact);
      updateString += 'donor_contact = $' + updateValues.length + ', ';
    }
  
    if (donor_email) {
      updateValues.push(donor_email);
      updateString += 'donor_email = $' + updateValues.length + ', ';
    }
  
    if (donor_address_line1) {
      updateValues.push(donor_address_line1);
      updateString += 'donor_address_line1 = $' + updateValues.length + ', ';
    }
  
    if (donor_address_line2) {
      updateValues.push(donor_address_line2);
      updateString += 'donor_address_line2 = $' + updateValues.length + ', ';
    }
  
    if (donor_state) {
      updateValues.push(donor_state);
      updateString += 'donor_state = $' + updateValues.length + ', ';
    }
  
    if (donor_city) {
      updateValues.push(donor_city);
      updateString += 'donor_city = $' + updateValues.length + ', ';
    }
  
    if (donor_zipcode) {
      updateValues.push(donor_zipcode);
      updateString += 'donor_zipcode = $' + updateValues.length + ', ';
    }
  
    if (email_opt_in !== undefined) {
      updateValues.push(email_opt_in);
      updateString += 'email_opt_in = $' + updateValues.length;
    } else {
      // Exclude email_opt_in from update if undefined
      updateString = updateString.slice(0, -2); // Remove trailing comma and space
    }
  
    const query = `UPDATE donor SET ${updateString} WHERE donor_id = $` + (updateValues.length + 1);
    updateValues.push(donorId);
  
    const result = await db.query(query, updateValues);
    return result.rowCount === 1 ? { ...data, donorId } : null; // Update success or failure indication
  },

  delete: async (donorId) => {
    const query = 'DELETE FROM donor WHERE donor_id = $1';
    const values = [donorId];
    const result = await db.query(query, values);
    return result.rowCount === 1; // Deletion success or failure indication
  },
};

module.exports = donor;