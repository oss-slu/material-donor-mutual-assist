import React, { useState } from 'react';
import DonorModal from './DonorModal';
import { Donor } from './DonorModal'; // Import the Donor type

const DonorList: React.FC = () => {
    const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Dummy donor list (replace with actual data)
    const donors: Donor[] = [
        {
            firstName: 'John',
            lastName: 'Doe',
            contact: '1234567890',
            email: 'john.doe@example.com',
            addressLine1: '123 Main St',
            addressLine2: '',
            state: 'California',
            city: 'Los Angeles',
            zipcode: '90001',
            emailOptIn: true,
        },
        // Add other donors here
    ];

    const handleDonorClick = (donor: Donor) => {
        setSelectedDonor(donor);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDonor(null);
    };

    return (
        <div>
            <h1>Donor List</h1>
            <ul>
                {donors.map((donor, index) => (
                    <li key={index}>
                        <button onClick={() => handleDonorClick(donor)}>
                            View Details for {donor.firstName} {donor.lastName}
                        </button>
                    </li>
                ))}
            </ul>

            {modalOpen && selectedDonor && (
                <DonorModal donor={selectedDonor} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default DonorList;
