// DonorForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DonorForm.css';

const DonorForm = () => {
  const [formData, setFormData] = useState({
    donor_firstName: '',
    donor_lastName: '',
    donor_contact: '',
    donor_email: '',
    donor_address_line1: '',
    donor_address_line2: '',
    donor_state: '',
    donor_city: '',
    donor_zipcode: '',
    email_opt_in: ''
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setErrorMessage(null); // Clear error on input change
    setSuccessMessage(null);
  };

  useEffect(() => {
    const handleRefresh = async () => {
      setFormData({ ...formData}); // Reset to default
    };
    handleRefresh();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    console.log("in validate")
    if (!formData.donor_firstName.trim()) {
      console.log("in if")

      newErrors.donor_firstName = 'First Name is required';
    }
    if (!formData.donor_lastName.trim()) {
      newErrors.donor_lastName = 'Last Name is required';
    }
    if (!formData.donor_email.trim()) {
      newErrors.donor_email = 'Email is required';
    } else if (!isValidEmail(formData.donor_email)) {
      newErrors.donor_email = 'Invalid email format';
    }
    if (!formData.donor_zipcode.trim()) {
      newErrors.donor_zipcode = 'Zip Code is required';
    } else if (!isValidZipCode(formData.donor_zipcode)) {
      newErrors.donor_zipcode = 'Invalid zip code format';
    }
    setErrors(newErrors);
    console.log(newErrors.donor_firstName)
    return Object.keys(newErrors).length === 0; // Form is valid if there are no errors
  };

  const isValidEmail = (email) => {
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidZipCode = (zipCode) => {
    // Basic zip code validation (5 digits)
    const regex = /^\d{5}$/;
    return regex.test(zipCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isFormValid = validateForm();
    console.log(isFormValid);
      if (isFormValid) {
        try {
          const response = await axios.post('http://localhost:5000/donor', formData)
          console.log(response.status)
          if (response.status===201){
            setSuccessMessage('Donor added successfully!');
            try{
              const donor_name = formData.donor_firstName+ " "+formData.donor_lastName
              const email = formData.donor_email
              const emailresponse = await axios.post('http://localhost:5001/send-email/', {
                donor_name,
                email,
              })            
              console.log(emailresponse.data, donor_name, email, emailresponse.status);
              if (emailresponse.status===200)
                setSuccessMessage('Email sent successfully!');
              else
                setErrorMessage('Email not sent');

            }
            catch(errorResponse) {
                console.error('Error sending email:', errorResponse);
            };
          }
          else
            setErrorMessage('Donor not added');
          setFormData({ // Clear form on success
            donor_firstName: '',
            donor_lastName: '',
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
        }
        catch (error) {
          setErrorMessage(error.response?.data?.message || 'Error adding donor');
        }
      } else {
        setErrorMessage('Form has validation errors');
    }
  };

  return (
    <div className="outer-container mx-auto p-4">
     <div className="donor-form">
      <h1 className="text-2xl font-bold mb-4">Add Donor Details</h1>
      {errorMessage && <p className="block text-sm font-semibold mb-1"
        style={{ backgroundColor: 'red' }}>
        {errorMessage}</p>}
      {successMessage && <p className="block text-sm font-semibold mb-1"
        style={{ backgroundColor: 'green' }}>
        {successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="donor_firstName" className="block text-sm font-semibold mb-1">First Name:</label>
          <input
            type="text"
            id="donor_firstName"
            name="donor_firstName"
            value={formData.donor_firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.donor_firstName ? 'border-red-500' : ''}`}
            
          />
          {errors.donor_firstName && <p className="text-red-500 text-sm mt-1" style={{color:"red"}}>{errors.donor_firstName}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="donor_lastName" className="block text-sm font-semibold mb-1">Last Name:</label>
          <input
            type="text"
            id="donor_lastName"
            name="donor_lastName"
            value={formData.donor_lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.donor_lastName ? 'border-red-500' : ''}`}
            
          />
          {errors.donor_lastName && <p className="text-red-500 text-sm mt-1" style={{color:"red"}}>{errors.donor_lastName}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="donor_contact" className="block text-sm font-semibold mb-1">Contact Number:</label>
          <input
            type="text"
            id="donor_contact"
            name="donor_contact"
            value={formData.donor_contact}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor_email" className="block text-sm font-semibold mb-1">Email:</label>
          <input
            type="email"
            id="donor_email"
            name="donor_email"
            value={formData.donor_email}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.donor_email ? 'border-red-500' : ''}`}
            
          />
          {errors.donor_email && <p className="text-red-500 text-sm mt-1" style={{color:"red"}}>{errors.donor_email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="donor_address_line1" className="block text-sm font-semibold mb-1">Address Line 1:</label>
          <input
            type="text"
            id="donor_address_line1"
            name="donor_address_line1"
            value={formData.donor_address_line1}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor_address_line2" className="block text-sm font-semibold mb-1">Address Line 2:</label>
          <input
            type="text"
            id="donor_address_line2"
            name="donor_address_line2"
            value={formData.donor_address_line2}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor_state" className="block text-sm font-semibold mb-1">State:</label>
          <input
            type="text"
            id="donor_state"
            name="donor_state"
            value={formData.donor_state}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor_city" className="block text-sm font-semibold mb-1">City:</label>
          <input
            type="text"
            id="donor_city"
            name="donor_city"
            value={formData.donor_city}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="donor_zipcode" className="block text-sm font-semibold mb-1">Zip Code:</label>
          <input
            type="text"
            id="donor_zipcode"
            name="donor_zipcode"
            value={formData.donor_zipcode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.donor_zipcode ? 'border-red-500' : ''}`}
            
          />
          {errors.donor_zipcode && <p className="text-red-500 text-sm mt-1" style={{color:"red"}}>{errors.donor_zipcode}</p>}
        </div>
        <div className="mb-4">
          <label >Email Opt-in:</label>
          <div className="radio-group">
            <label htmlFor="email_opt_in_yes">
              <input
                type="radio"
                id="email_opt_in_yes"
                name="email_opt_in"
                value="Yes"
                checked={formData.email_opt_in === 'Yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label htmlFor="email_opt_in_no">
              <input
                type="radio"
                id="email_opt_in_no"
                name="email_opt_in"
                value="No"
                checked={formData.email_opt_in === 'No'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full button-margin"
          style={{ backgroundColor: 'blue' }}>
          Add Donor
        </button>
        <button 
          type="button" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full button-margin"
          style={{ backgroundColor: 'blue' }}
          //onClick={() => setFormData({ ...formData, email_opt_in: '' })}
          >
          Refresh
        </button>
      </form>
     </div> 
    </div>
  );
};

export default DonorForm;


