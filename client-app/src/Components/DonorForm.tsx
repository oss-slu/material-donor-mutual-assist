import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import '../css/DonorForm.css';

interface FormData {
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  zipcode: string;
  emailOptIn: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const DonorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    zipcode: '',
    emailOptIn: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle input change for all fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prevState => ({ ...prevState, [name]: '' })); // Reset errors on change
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Generalized validation function to reduce code repetition
  const validateField = (name: string, value: string) => {
    if (!value.trim()) return `${name} is required`;
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    if (name === 'zipcode' && !/^\d{5}$/.test(value)) {
      return 'Invalid zip code format';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    ['firstName', 'lastName', 'contact', 'email', 'addressLine1', 'state', 'city', 'zipcode'].forEach(field => {
      const error = validateField(field, (formData as any)[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to submit the form
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5000/donor', formData);
        if (response.status === 201) {
          setSuccessMessage('Donor added successfully!');
          setFormData({
            firstName: '',
            lastName: '',
            contact: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            city: '',
            zipcode: '',
            emailOptIn: false,
          });
        } else {
          setErrorMessage('Donor not added');
        }
      } catch (error: unknown) {
        const message = (error as any).response?.data?.message || 'Error adding donor';
        setErrorMessage(message);
      }
    } else {
      setErrorMessage('Form has validation errors');
    }
  };

  // Function to reset all form fields
  const handleRefresh = () => {
    setFormData({
      firstName: '',
      lastName: '',
      contact: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      zipcode: '',
      emailOptIn: false,
    });
    setErrors({});
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Reusable function to render form fields (for text and checkbox types)
  const renderFormField = (label: string, name: keyof FormData, type = 'text', required = true) => (
    <div className="form-field">
      <label htmlFor={name} className="block text-sm font-semibold mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'checkbox' ? (
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={formData[name] as boolean} // Handle checkbox separately
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border"
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name] as string} // Ensure value is string for text inputs
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="donor-form outer-container mx-auto p-10">
      <h1 className="text-2xl font-bold heading-centered">Add Donor Details</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="form-grid">
        {renderFormField('First Name', 'firstName')}
        {renderFormField('Last Name', 'lastName')}
        {renderFormField('Contact', 'contact')}
        {renderFormField('Email', 'email', 'email')}
        {renderFormField('Address Line 1', 'addressLine1')} {/* Mandatory with * */}
        {renderFormField('Address Line 2', 'addressLine2', 'text', false)} {/* Not required */}
        {renderFormField('State', 'state')}
        {renderFormField('City', 'city')}
        {renderFormField('Zip Code', 'zipcode')}
        
        
         {/* Email Opt-In Field */}
           <div className="form-field">
            <label htmlFor="emailOptIn" className="block text-sm font-semibold mb-1">
               Email Opt-in
             </label>
             <div className="checkbox-container">
               <input
                 type="checkbox"
                 id="emailOptIn"
                 name="emailOptIn"
                 checked={formData.emailOptIn}
                 onChange={handleChange}
               />
               <span className="checkbox-message"> Stay updated with donation progress</span>
             </div>
           </div>

        <div className="form-field full-width button-container">
          <button type="submit" className="submit-button">Add Donor</button>
          <button type="button" onClick={handleRefresh} className="refresh-button">Refresh</button>
        </div>
      </form>
    </div>
  );
};

export default DonorForm;
