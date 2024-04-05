// DonorForm.js

import React, { useState } from 'react';

const DonorForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    zipCode: '',
    contactNumber: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'Zip Code is required';
    } else if (!isValidZipCode(formData.zipCode)) {
      newErrors.zipCode = 'Invalid zip code format';
    }
    setErrors(newErrors);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Form submission logic here
      console.log('Form submitted:', formData);
    } else {
      console.log('Form has validation errors');
    }
  };

  return (
    <div className="container mx-auto p-4">
     <div className="donor-form">
      <h1 className="text-2xl font-bold mb-4">Add Donor Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-semibold mb-1">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.firstName ? 'border-red-500' : ''}`}
            required
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-semibold mb-1">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.lastName ? 'border-red-500' : ''}`}
            required
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.email ? 'border-red-500' : ''}`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-semibold mb-1">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="zipCode" className="block text-sm font-semibold mb-1">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded border ${errors.zipCode ? 'border-red-500' : ''}`}
            required
          />
          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="contactNumber" className="block text-sm font-semibold mb-1">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
          style={{ backgroundColor: 'blue' }}
        >
          Add Donor
        </button>
      </form>
     </div> 
    </div>
  );
};

export default DonorForm;


