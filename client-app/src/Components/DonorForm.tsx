// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import axios from 'axios';
// import '../css/DonorForm.css';

// interface FormData {
//   firstName: string;
//   lastName: string;
//   contact: string;
//   email: string;
//   addressLine1: string;
//   addressLine2: string;
//   state: string;
//   city: string;
//   zipcode: string;
//   emailOptIn: boolean;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// const DonorForm: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     contact: '',
//     email: '',
//     addressLine1: '',
//     addressLine2: '',
//     state: '',
//     city: '',
//     zipcode: '',
//     emailOptIn: false,
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Mandatory fields array
//   const mandatoryFields = [
//     'firstName',
//     'lastName',
//     'contact',
//     'email',
//     'addressLine1',
//     'state',
//     'city',
//     'zipcode',
//   ];

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     setErrors(prevState => ({ ...prevState, [name]: '' }));
//     setErrorMessage(null);
//     setSuccessMessage(null);
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
//     if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.zipcode.trim()) {
//       newErrors.zipcode = 'Zip Code is required';
//     } else if (!/^\d{5}$/.test(formData.zipcode)) {
//       newErrors.zipcode = 'Invalid zip code format';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await axios.post('http://localhost:5000/donor', formData);
//         if (response.status === 201) {
//           setSuccessMessage('Donor added successfully!');
//           setFormData({
//             firstName: '',
//             lastName: '',
//             contact: '',
//             email: '',
//             addressLine1: '',
//             addressLine2: '',
//             state: '',
//             city: '',
//             zipcode: '',
//             emailOptIn: false,
//           });
//         } else {
//           setErrorMessage('Donor not added');
//         }
//       } catch (error: unknown) {
//         const message = (error as any).response?.data?.message || 'Error adding donor';
//         setErrorMessage(message);
//       }
//     } else {
//       setErrorMessage('Form has validation errors');
//     }
//   };

//   return (
//     <div className="outer-container mx-auto p-10">
//       <div className="donor-form">
//         <h1 className="text-2xl font-bold">Add Donor Details</h1>
//         {errorMessage && <p className="block text-sm font-semibold mb-1" style={{ backgroundColor: 'red' }}>{errorMessage}</p>}
//         {successMessage && <p className="block text-sm font-semibold mb-1" style={{ backgroundColor: 'green' }}>{successMessage}</p>}
//         <form onSubmit={handleSubmit} className="form-grid">
//           <div className="form-field">
//             <label htmlFor="firstName" className="block text-sm font-semibold mb-1">
//               First Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="firstName"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="lastName" className="block text-sm font-semibold mb-1">
//               Last Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="lastName"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="contact" className="block text-sm font-semibold mb-1">
//               Contact <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="contact"
//               name="contact"
//               value={formData.contact}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="email" className="block text-sm font-semibold mb-1">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="addressLine1" className="block text-sm font-semibold mb-1">
//               Address Line 1 <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="addressLine1"
//               name="addressLine1"
//               value={formData.addressLine1}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="addressLine2" className="block text-sm font-semibold mb-1">
//               Address Line 2
//             </label>
//             <input
//               type="text"
//               id="addressLine2"
//               name="addressLine2"
//               value={formData.addressLine2}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.addressLine2 ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.addressLine2 && <p className="text-red-500 text-sm mt-1">{errors.addressLine2}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="state" className="block text-sm font-semibold mb-1">
//               State <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="state"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="city" className="block text-sm font-semibold mb-1">
//               City <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//           </div>

//           <div className="form-field">
//             <label htmlFor="zipcode" className="block text-sm font-semibold mb-1">
//               Zip Code <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="zipcode"
//               name="zipcode"
//               value={formData.zipcode}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 rounded border ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>}
//           </div>

//           {/* Email Opt-In Field */}
//           <div className="form-field">
//             <label htmlFor="emailOptIn" className="block text-sm font-semibold mb-1">
//               Email Opt-in
//             </label>
//             <div className="checkbox-container">
//               <input
//                 type="checkbox"
//                 id="emailOptIn"
//                 name="emailOptIn"
//                 checked={formData.emailOptIn}
//                 onChange={handleChange}
//               />
//               <span className="checkbox-message"> Stay updated with donation progress</span>
//             </div>
//           </div>

//           <div className="form-field full-width button-container">
//             <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
//               Add Donor
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DonorForm;

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
        
        {/* Checkbox for email opt-in with two-letter space before message */}
        <div className="form-field">
          <label htmlFor="emailOptIn" className="block text-sm font-semibold mb-1">
            <input
              type="checkbox"
              id="emailOptIn"
              name="emailOptIn"
              checked={formData.emailOptIn}
              onChange={handleChange}
              className="mr-2"
            />
            Stay updated with donation progress
          </label>
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
