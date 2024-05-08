import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DonationForm = () => {
  const navigate = useNavigate(); // Create an instance of useNavigate

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Here you would typically handle the form submission, e.g., save data to a database

    // After form submission is handled, navigate to the donations page
    navigate('/Donations'); // Adjust '/donations' to your specific route
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Add a donation</h2>
      
      <form onSubmit={handleSubmit}> {/* Update form to handle on submit */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="itemType">
            Item Type
          </label>
          <select id="itemType" name="itemType" className="border p-2 w-full">
            {/* Options */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="productNumber">
            Product Number
          </label>
          <input
            type="text"
            id="productNumber"
            name="productNumber"
            className="border p-2 w-full"
            placeholder="Enter product number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="donor">
            Donor
          </label>
          <input
            type="text"
            id="donor"
            name="donor"
            className="border p-2 w-full"
            placeholder="Enter donor name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="details">
            Other details
          </label>
          <textarea
            id="details"
            name="details"
            rows={3}
            className="border p-2 w-full"
            placeholder="Provide additional details"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded mr-2"
        >
          Save
        </button>
        <button
          type="reset"
          className="bg-gray-400 text-white p-2 rounded"
        >
          Clear
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
