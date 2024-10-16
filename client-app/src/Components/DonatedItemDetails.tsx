import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    startDate: Date;
    aimAndCause: string;
}

interface StatusLog {
    id: number;
    type: string;
    dateModified: Date;
}

interface DonatedItem {
    id: number;
    itemType: string;
    currentStatus: string;
    dateDonated: Date;
    lastUpdated: Date;
    donor: Donor;
    program: Program;
    statuses: StatusLog[];
}

const DonatedItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [donatedItem, setDonatedItem] = useState<DonatedItem | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDonatedItemDetails = async () => {
            try {
                const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;
                const response = await axios.get<DonatedItem>(`${API_BASE_URL}donatedItem/${id}`);
                setDonatedItem(response.data);
            } catch (err) {
                setError('Failed to fetch donated item details');
                console.error('Error fetching donated item:', err);
            }
        };

        fetchDonatedItemDetails();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!donatedItem) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Donated Item Details</h1>
            <h2>Item Details</h2>
            <p>Type: {donatedItem.itemType}</p>
            <p>Status: {donatedItem.currentStatus}</p>
            <p>Donated On: {donatedItem.dateDonated.toDateString()}</p>
            <p>Last Updated: {donatedItem.lastUpdated.toDateString()}</p>

            <h2>Donor Details</h2>
            <p>Name: {donatedItem.donor.firstName} {donatedItem.donor.lastName}</p>
            <p>Email: {donatedItem.donor.email}</p>
            <p>Contact: {donatedItem.donor.contact}</p>
            <p>Address: {donatedItem.donor.addressLine1}, {donatedItem.donor.addressLine2 ?? ''}</p>
            <p>City/State: {donatedItem.donor.city}, {donatedItem.donor.state} {donatedItem.donor.zipcode}</p>

            <h2>Program Details</h2>
            <p>Name: {donatedItem.program.name}</p>
            <p>Description: {donatedItem.program.description}</p>
            <p>Start Date: {donatedItem.program.startDate.toDateString()}</p>
            <p>Aim and Cause: {donatedItem.program.aimAndCause}</p>

            <h2>Status Logs</h2>
            {donatedItem.statuses.map(status => (
                <div key={status.id}>
                    <p>Status: {status.type} - Modified on {status.dateModified.toDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default DonatedItemDetails;
