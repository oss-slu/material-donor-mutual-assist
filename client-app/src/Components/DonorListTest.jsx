import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import DonorList from './DonorList'; // Adjust the import based on your file structure

jest.mock('axios');

describe('DonorList Component', () => {
    test('renders donor details correctly', async () => {
        // Mock the response from the API
        const donorsData = [
            {
                donorId: 811253,
                firstName: 'Jason',
                lastName: 'Todd',
                email: 'red@icloud.com',
                contact: '123-456-7890',
                addressLine1: '123 Main St',
                addressLine2: '',
                city: 'Springfield',
                state: 'IL',
                zipcode: '62701',
                emailOptIn: true,
            },
            // Add more mock donors as needed
        ];
        
        axios.get.mockResolvedValueOnce({ data: donorsData });

        render(<DonorList />);

        // Wait for the donor list to be rendered
        await waitFor(() => expect(screen.getByText('Donor ID')).toBeInTheDocument());

        // Check if donor details are displayed
        expect(screen.getByText('Jason')).toBeInTheDocument();
        expect(screen.getByText('red@icloud.com')).toBeInTheDocument();
        
        // Simulate clicking the view details button
        fireEvent.click(screen.getByText('View More Details'));

        // Verify modal content
        expect(screen.getByText('Donor ID: 811253')).toBeInTheDocument();
        expect(screen.getByText('Opted in for Emails: true')).toBeInTheDocument();
    });

    test('displays error message when fetching donors fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(<DonorList />);

        // Wait for the error message to be displayed
        await waitFor(() => expect(screen.getByText('Error fetching donor data')).toBeInTheDocument());
    });
});