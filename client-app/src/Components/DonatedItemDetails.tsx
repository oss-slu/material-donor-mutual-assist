import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import '../css/DonatedItemDetails.css'; // Import the new CSS file

interface Donor {
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

interface Program {
    id: number;
    name: string;
    description: string;
    startDate: string;
    aimAndCause: string;
}

interface StatusLog {
    id: number;
    type: string;
    dateModified: string;
}

interface DonatedItem {
    id: number;
    itemType: string;
    currentStatus: string;
    dateDonated: string;
    lastUpdated: string;
    donor: Donor;
    program: Program;
    statuses: StatusLog[];
}

const DonatedItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [donatedItem, setDonatedItem] = useState<DonatedItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDonatedItemDetails = async () => {
            try {
        
                const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL || '';
                console.log(API_BASE_URL);
                console.log(id);
                const response = await axios.get<DonatedItem>(`${API_BASE_URL}donatedItem/${id}`);
                
                console.log(response);
                setDonatedItem(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(`Failed to fetch donated item details: ${err.response?.statusText || 'Server error'}`);
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
                    <section className="item-details-section">
                        <div className="section-header">
                            <CategoryIcon className="icon" />
                            <h2>Item Details</h2>
                        </div>
                        <p><strong>Type:</strong> {donatedItem.itemType}</p>
                        <p><strong>Status:</strong> {donatedItem.currentStatus}</p>
                        <p><strong>Donated On:</strong> {formatDate(donatedItem.dateDonated)}</p>
                        <p><strong>Last Updated:</strong> {formatDate(donatedItem.lastUpdated)}</p>
                    </section>

                    <section className="status-logs-section">
                        <div className="section-header">
                            <AssignmentTurnedInIcon className="icon" />
                            <h2>Status Logs</h2>
                        </div>
                        {donatedItem.statuses.map(status => (
                            <p key={status.id}><strong>Status:</strong> {status.type} - <strong>Modified on:</strong> {formatDate(status.dateModified)}</p>
                        ))}
                    </section>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    <section className="donor-details-section">
                        <div className="section-header">
                            <PersonIcon className="icon" />
                            <h2>Donor Details</h2>
                        </div>
                        <p><strong>Name:</strong> {donatedItem.donor.firstName} {donatedItem.donor.lastName}</p>
                        <p><strong>Email:</strong> {donatedItem.donor.email}</p>
                        <p><strong>Contact:</strong> {donatedItem.donor.contact}</p>
                        <p><strong>Address:</strong> {donatedItem.donor.addressLine1}, {donatedItem.donor.addressLine2 ?? ''}</p>
                        <p><strong>City/State:</strong> {donatedItem.donor.city}, {donatedItem.donor.state} {donatedItem.donor.zipcode}</p>
                    </section>

                    <section className="program-details-section">
                        <div className="section-header">
                            <EventNoteIcon className="icon" />
                            <h2>Program Details</h2>
                        </div>
                        <p><strong>Name:</strong> {donatedItem.program.name}</p>
                        <p><strong>Description:</strong> {donatedItem.program.description}</p>
                        <p><strong>Start Date:</strong> {formatDate(donatedItem.program.startDate)}</p>
                        <p><strong>Aim and Cause:</strong> {donatedItem.program.aimAndCause}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DonatedItemDetails;