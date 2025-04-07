// DonorModal.tsx

import React, { useEffect, useState } from 'react';

export interface Donor {
  id: number;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  state: string;
  city: string;
  zipcode: string;
  emailOptIn: boolean;
}

interface DonorModalProps {
  donor: Donor;
  onClose: () => void;
}

const DonorModal: React.FC<DonorModalProps> = ({ donor, onClose }) => {
  const [navbarHeight, setNavbarHeight] = useState<number>(0);

  useEffect(() => {
    // Dynamically calculate navbar height
    const navbar = document.querySelector('.navbar') as HTMLElement;
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight); // Get navbar height
    }
  }, []);

  return (
    <div
      className="modal"
      style={{
        position: 'fixed',
        top: `${navbarHeight}px`, // Set top to be below the navbar
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        zIndex: 1050,
        maxHeight: '80vh', // Limit the modal height to 80% of the viewport height
        overflow: 'hidden',
      }}
    >
      <div
        className="modal-content"
        style={{
          maxHeight: '70vh', // Maximum content height inside modal
          overflowY: 'auto', // Enable scrolling inside the modal when content exceeds height
          padding: '20px',
          backgroundColor: 'white',
        }}
      >
        <h2>Donor Details</h2>
        <p><strong>First Name:</strong> {donor.firstName}</p>
        <p><strong>Last Name:</strong> {donor.lastName}</p>
        <p><strong>Email:</strong> {donor.email}</p>
        <p><strong>Contact:</strong> {donor.contact}</p>
        <p><strong>Address:</strong> {donor.addressLine1} {donor.addressLine2 && `, ${donor.addressLine2}`}</p>
        <p><strong>State:</strong> {donor.state}</p>
        <p><strong>City:</strong> {donor.city}</p>
        <p><strong>Zipcode:</strong> {donor.zipcode}</p>
        <p><strong>Email Opt-In:</strong> {donor.emailOptIn ? 'Yes' : 'No'}</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DonorModal;
