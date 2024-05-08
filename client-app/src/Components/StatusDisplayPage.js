import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/StatusDisplayPage.css';

const StatusDisplayPage = () => {
  const location = useLocation();
  const itemInfo = location.state.itemInfo;
  const navigate = useNavigate();

  const [donorInfo, setDonorInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    status: {
      donated: false,
      inStorageFacility: false,
      refurbished: false,
      received: false,
      sold: false
    },
    image: null
  });

  // Simulating API call to fetch donor data
  useEffect(() => {
    // Replace with your actual API call logic
    // For now, setting dummy data
    const dummyData = {
      fullName: 'Donor Full Name',
      email: 'donor@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      status: {
        donated: true,
        inStorageFacility: true,
        refurbished: true,
        received: true,
        sold: true
      }
    };
    setDonorInfo(dummyData);
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDonorInfo({
      ...donorInfo,
      status: { ...donorInfo.status, [name]: checked }
    });
  };

  // Function to handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setDonorInfo({
      ...donorInfo,
      image: URL.createObjectURL(file) // Generate a temporary URL for the selected image
    });
  };
  const handleSaveChanges = () => {
    // Logic to handle save changes
    navigate('/Donations'); // Adjust '/donations' to your specific route
  };

  const handleCancel = () => {
    navigate('/Donations'); // Adjust '/donations' to your specific route
  };

  if (!itemInfo) {
    return <div>No item information found</div>;
  }

  return (
    <div className="status-display">
      <div className="donor-form">
        <img
          src="https://www.bworks.org/wp-content/themes/bworks/library/images/logo-bworks.png"
          alt="BWorks Logo"
          className="bworks-logo"
        />
        <label>Item: {itemInfo.id}</label>
        <label>
          Donor Full Name: {itemInfo.donor}
        </label>
        <br />
        <label>
          Email Address: {donorInfo.email}
        </label>
        <br />
        <label>
          Phone Number: {donorInfo.phone}
        </label>
        <br />
        <label>
          Address: {donorInfo.address}
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="status"
            checked={donorInfo.status.donated}
            onChange={handleCheckboxChange}
          />
          Donated
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="status"
            checked={donorInfo.status.inStorageFacility}
            onChange={handleCheckboxChange}
          />
          In Storage Facility
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="status"
            checked={donorInfo.status.refurbished}
            onChange={handleCheckboxChange}
          />
          Refurbished
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="status"
            checked={donorInfo.status.received}
            onChange={handleCheckboxChange}
          />
          Received
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="status"
            checked={donorInfo.status.sold}
            onChange={handleCheckboxChange}
          />
          Sold
        </label>
        <br></br>
        <label>
          Upload Image of current Status:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
        <br></br>
        {/* Display uploaded image */}
        {donorInfo.image && (
          <img src={donorInfo.image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        )}
        <br />
        
        <br />
        <button type="button" onClick={handleCancel}>Cancel</button>
        <br />
        <button type="submit" onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
};

export default StatusDisplayPage;







