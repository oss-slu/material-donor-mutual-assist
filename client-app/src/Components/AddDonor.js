import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for HTTP requests

function AddDonorForm() {
  const [donorData, setDonorData] = useState({
    donor_name: '',
    donor_contact: '',
    donor_email: '',
    donor_address_line1: '',
    donor_address_line2: '',
    donor_state: '',
    donor_city: '',
    donor_zipcode: '',
    email_opt_in: ''
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (event) => {
    setDonorData({ ...donorData, [event.target.name]: event.target.value });
    setErrorMessage(null); // Clear error on input change
    setSuccessMessage(null);
  };

  useEffect(() => {
    // Simulate data fetching or resetting on some event (e.g., button click)
    const handleRefresh = async () => {
      // Replace with your logic to fetch or reset data (optional)
      setDonorData({ ...donorData}); // Reset to default
    };
    handleRefresh();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/donor', donorData);
      setSuccessMessage('Donor added successfully!');
      setDonorData({ // Clear form on success
        donor_name: '',
        donor_contact: '',
        donor_email: '',
        donor_address_line1: '',
        donor_address_line2: '',
        donor_state: '',
        donor_city: '',
        donor_zipcode: '',
        email_opt_in: ''
        // ... other donor fields (optional)
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding donor');
    }
  };

  return (
    <div>
      <h2>Add Donor</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="donor_name">Name:</label>
        <input type="text" id="donor_name" name="donor_name" value={donorData.donor_name} onChange={handleChange} required />

        <label htmlFor="donor_contact">Contact:</label>
        <input type="number" id="donor_contact" name="donor_contact" value={donorData.donor_contact} onChange={handleChange} />

        <label htmlFor="donor_email">Email:</label>
        <input type="email" id="donor_email" name="donor_email" value={donorData.donor_email} onChange={handleChange} required />

        <label htmlFor="donor_address_line1">Address Line 1:</label>
        <input type="text" id="donor_address_line1" name="donor_address_line1" value={donorData.donor_address_line1} onChange={handleChange} />

        <label htmlFor="donor_address_line2">Address Line 2:</label>
        <input type="text" id="donor_address_line2" name="donor_address_line2" value={donorData.donor_address_line2} onChange={handleChange} />

        <label htmlFor="donor_state">State:</label>
        <input type="text" id="donor_state" name="donor_state" value={donorData.donor_state} onChange={handleChange} />

        <label htmlFor="donor_city">City:</label>
        <input type="text" id="donor_city" name="donor_city" value={donorData.donor_city} onChange={handleChange} />

        <label htmlFor="donor_zipcode">Zip code:</label>
        <input type="number" id="donor_zipcode" name="donor_zipcode" value={donorData.donor_zipcode} onChange={handleChange} required />

        <label>Email Opt-in:</label>
        <div className="radio-group">
          <input
            type="radio"
            id="email_opt_in_yes"
            name="email_opt_in"
            value="Yes"
            checked={donorData.email_opt_in === 'Yes'}
            onChange={handleChange}
          />
          <label htmlFor="email_opt_in_yes">Yes</label>
          <input
            type="radio"
            id="email_opt_in_no"
            name="email_opt_in"
            value="No"
            checked={donorData.email_opt_in === 'No'}
            onChange={handleChange}
          />
          <label htmlFor="email_opt_in_no">No</label>
        </div>

        <button type="submit">Add Donor</button>
        <button type="button" onClick={() => setDonorData({ ...donorData, email_opt_in: 'Yes' })}>
          Refresh
        </button>
      </form>
    </div>
  );
}

export default AddDonorForm;