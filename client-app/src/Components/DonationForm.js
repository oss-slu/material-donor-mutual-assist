// DonationForm.js

import React from 'react';

const DonationForm = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Add a donation</h2>
      
      <form>
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
