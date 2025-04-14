import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { act } from '@testing-library/react';
import DonorList from '../Components/DonorList';

jest.mock('axios');

describe('DonorList Component', () => {
    beforeAll(() => {
    process.env.REACT_APP_BACKEND_API_BASE_URL = 'http://localhost:5000/';
    localStorage.setItem('token', 'mock-token');
    /*beforeAll(async () => {
        const credentials = {
            email: 'testadmin@test.edu',
            password: 'testPassword11!',
        };
        try {
            const temp = await axios.post(
                `http://localhost:5000/api/register`,
                //`${process.env.REACT_APP_BACKEND_API_BASE_URL}api/register`,
                {
                    name: 'Admin',
                    email: credentials.email,
                    password: credentials.password,
                },
            );
            const response = await axios.post(
                `http://localhost:5000/api/login`,
                //`${process.env.REACT_APP_BACKEND_API_BASE_URL}api/login`,
                credentials,
            );
            const { token } = response.data;
            localStorage.setItem('token', token);
        } catch (error) {
            console.error('Error during registration or login:');

            if (axios.isAxiosError(error)) {
                console.error('Axios error message:', error.message);
                console.error('Axios error response:', error.response?.data);
                console.error('Axios error status:', error.response?.status);
            } else {
                console.error('Unexpected error:', error);
            }
        }*/
    });
    // beforeAll(() => {
    //     // Option 1: Mock the login response and store token
    //     (axios.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Registered' } });
    //     (axios.post as jest.Mock).mockResolvedValueOnce({ data: { token: 'test-token' } });
    //     localStorage.setItem('token', 'test-token');
    // });
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
            {
                firstName: 'Big',
                lastName: 'Guy',
                contact: '3149777588',
                email: 'example.user1234567890@randommailservice.com',
                addressLine1: 'Who knows',
                addressLine2: '',
                state: 'OK',
                city: 'Oaky',
                zipcode: '9546',
                emailOptIn: false,
            },
        ];

        axios.get.mockResolvedValueOnce({ data: donorsData });

        render(<DonorList />);

        // Wait for the donor list to be rendered
        await waitFor(() =>
            expect(screen.getByText('Donor ID')).toBeInTheDocument(),
        );

        // Check if donor details are displayed
        expect(screen.getByText('Jason')).toBeInTheDocument();
        expect(screen.getByText('red@icloud.com')).toBeInTheDocument();

        // Simulate clicking the view details button
        fireEvent.click(screen.getByText('View More Details'));

        // Verify modal content
        expect(screen.getByText('Donor ID: 811253')).toBeInTheDocument();
        expect(
            screen.getByText('Opted in for Emails: true'),
        ).toBeInTheDocument();
    });

    test('displays error message when fetching donors fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        render(<DonorList />);

        // Wait for the error message to be displayed
        await waitFor(() =>
            expect(
                screen.getByText('Error fetching donor data'),
            ).toBeInTheDocument(),
        );
    });
});
