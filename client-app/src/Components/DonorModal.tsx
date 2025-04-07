import React from 'react';
import './DonorModal.css'; // Make sure the updated CSS file is imported

interface DonorModalProps {
    isOpen: boolean;
    onClose: () => void;
    donorData: any; // Add correct type for donor data
}

const DonorModal: React.FC<DonorModalProps> = ({
    isOpen,
    onClose,
    donorData,
}) => {
    if (!isOpen) return null; // If modal is not open, return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>
                    X
                </button>
                <div className="modal-header">
                    <h2>Donor Details</h2>
                </div>
                <div className="modal-content-body">
                    <p>
                        <strong>Name:</strong> {donorData.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {donorData.email}
                    </p>
                    {/* Render other donor details */}
                    <button className="edit-button">Edit</button>
                </div>
            </div>
        </div>
    );
};

export default DonorModal;
