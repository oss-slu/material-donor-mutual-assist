import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stepper, Step, StepLabel, StepContent, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import '../css/DonatedItemDetails.css'; // Import the new CSS file
import { Donor } from '../Modals/DonorModal';
import { Program } from '../Modals/ProgramModal';
import { DonatedItemStatus } from '../Modals/DonatedItemStatusModal';
import { DonatedItem } from '../Modals/DonatedItemModal';

const DonatedItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [donatedItem, setDonatedItem] = useState<DonatedItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleAddNewDonationClick = (): void => {
        navigate(`/donatedItem/status/${id}`);
    };

    useEffect(() => {
        const fetchDonatedItemDetails = async () => {
            try {
                const API_BASE_URL =
                    process.env.REACT_APP_BACKEND_API_BASE_URL || '';
                console.log(API_BASE_URL);
                console.log(id);
                const response = await axios.get<DonatedItem>(
                    `${API_BASE_URL}donatedItem/${id}`,
                );

                console.log(response);
                setDonatedItem(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(
                        `Failed to fetch donated item details: ${err.response?.statusText || 'Server error'}`,
                    );
                } else {
                    setError('An unexpected error occurred');
                }
                console.error('Error fetching donated item:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonatedItemDetails();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid date' : date.toDateString();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!donatedItem) return <div>No data available.</div>;

    return (
        <div className="donated-item-details-container">
            <h1>Donated Item Details</h1>
            <div className="details-grid">
                {/* Left Column */}
                <div className="left-column">
                    
                    {/* Vertical stepper implementation for donated item status */}
                    <section className="donated-item-status-section">
                        <div className="section-header">
                            <AssignmentTurnedInIcon className="icon" />
                            <h2>Donated Item Status</h2>
                            <button onClick={() => navigate(`/donatedItem/status/${id}`)}>
                                Add New Status
                            </button>
                        </div>
                <Stepper orientation="vertical">
                            {donatedItem.statuses.map((status) => (
                                <Step key={status.id} active={true} completed={false}>
                                    <StepLabel>{`${status.statusType} (${formatDate(status.dateModified)})`}</StepLabel>
                                   
                                    <StepContent>
                                    <div className="image-scroll-container">
                                    {status.images.map((image, idx) => (
                                        <img key={idx} src={`data:image/jpeg;base64,${image}`} alt={`Status Image ${idx}`} className="status-image" />
                                    ))}
                                </div>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </section>
                </div>

                {/* Right Column */}
                <div className="right-column">

                <section className="item-details-section">
                        <div className="section-header">
                            <CategoryIcon className="icon" />
                            <h2>Item Details</h2>
                        </div>
                        <p>
                            <strong>Type:</strong> {donatedItem.itemType}
                        </p>
                        <p>
                            <strong>Status:</strong> {donatedItem.currentStatus}
                        </p>
                        <p>
                            <strong>Donated On:</strong>{' '}
                            {formatDate(donatedItem.dateDonated)}
                        </p>
                        <p>
                            <strong>Last Updated:</strong>{' '}
                            {formatDate(donatedItem.lastUpdated)}
                        </p>
                    </section>

                    <section className="donor-details-section">
                        <div className="section-header">
                            <PersonIcon className="icon" />
                            <h2>Donor Details</h2>
                        </div>
                        <p>
                            <strong>Name:</strong> {donatedItem.donor.firstName}{' '}
                            {donatedItem.donor.lastName}
                        </p>
                        <p>
                            <strong>Email:</strong> {donatedItem.donor.email}
                        </p>
                        <p>
                            <strong>Contact:</strong>{' '}
                            {donatedItem.donor.contact}
                        </p>
                        <p>
                            <strong>Address:</strong>{' '}
                            {donatedItem.donor.addressLine1},{' '}
                            {donatedItem.donor.addressLine2 ?? ''}
                        </p>
                        <p>
                            <strong>City/State:</strong>{' '}
                            {donatedItem.donor.city}, {donatedItem.donor.state}{' '}
                            {donatedItem.donor.zipcode}
                        </p>
                    </section>

                    <section className="program-details-section">
                        <div className="section-header">
                            <EventNoteIcon className="icon" />
                            <h2>Program Details</h2>
                        </div>
                        <p>
                            <strong>Name:</strong> {donatedItem.program.name}
                        </p>
                        <p>
                            <strong>Description:</strong>{' '}
                            {donatedItem.program.description}
                        </p>
                        <p>
                            <strong>Start Date:</strong>{' '}
                            {formatDate(donatedItem.program.startDate)}
                        </p>
                        <p>
                            <strong>Aim and Cause:</strong>{' '}
                            {donatedItem.program.aimAndCause}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DonatedItemDetails;
