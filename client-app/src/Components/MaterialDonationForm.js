// MaterialDonationForm.js

import React, { useState } from 'react';

const MaterialDonationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    donationDate: '',
    materials: [{ materialType: 'Bicycles', condition: 'New', quantity: '' }],
    comments: '',
    optIn: false,
  });

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (name === 'materialType' || name === 'condition' || name === 'quantity') {
      const updatedMaterials = [...formData.materials];
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [name]: type === 'checkbox' ? checked : value,
      };
      setFormData({ ...formData, materials: updatedMaterials });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { materialType: 'Bicycles', condition: 'New', quantity: '' }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Material Donation Registration</h1>
        

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
              Full Name:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {/* Other form fields... */}
          <div className="mb-4">
            <label htmlFor="zipcode" className="block text-gray-700 text-sm font-bold mb-2">
              Zip Code:
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          

          {formData.materials.map((material, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Material Type:
              </label>
              <select
                name="materialType"
                value={material.materialType}
                onChange={(e) => handleChange(e, index)}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Bicycles">Bicycles</option>
                <option value="Computers">Computers</option>
              </select>

              <label className="block text-gray-700 text-sm font-bold mb-2">
                Condition:
              </label>
              <select
                name="condition"
                value={material.condition}
                onChange={(e) => handleChange(e, index)}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>

              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                value={material.quantity}
                onChange={(e) => handleChange(e, index)}
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMaterial}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            Add Material
          </button>

          <div className="mb-4">
            <label htmlFor="donationDate" className="block text-gray-700 text-sm font-bold mb-2">
              Donation Date:
            </label>
            <input
              type="date"
              id="donationDate"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">
              Additional Information or Comments:
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>


          <div className="mb-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialDonationForm;
