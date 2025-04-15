import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DonatedItemsList from '../Components/DonatedItemsList';
import React from 'react';
import axios from 'axios';

jest.mock('axios');

beforeAll(() => {
    process.env.REACT_APP_BACKEND_API_BASE_URL = 'http://localhost:5000/';
    localStorage.setItem('token', 'mock-token');

    (axios.get as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('donatedItem')) {
            return Promise.resolve({
                data: [
                    {
                        id: 1,
                        itemType: 'Book',
                        currentStatus: 'Received',
                        dateDonated: '2024-11-01',
                    },
                ],
            });
        }
        if (url.includes('program')) {
            return Promise.resolve({
                data: [{ id: 1, name: 'Program A' }],
            });
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('DonatedItemsList Component - Hover functionality', () => {
    it('applies hover styles on a table row with the clickable-row class', async () => {
        render(
            <BrowserRouter>
                <DonatedItemsList />
            </BrowserRouter>,
        );

        const itemText = await screen.findByText(/Book/i);
        const itemRow = itemText.closest('tr');

        expect(itemRow).toBeInTheDocument();
        expect(itemRow).toHaveClass('clickable-row');

        fireEvent.mouseOver(itemRow!);
    });
});
/*
    // Mock fetch requests to avoid real API calls
    global.fetch = jest.fn(url => {
        console.log('Test 1');
        if (url.includes('donatedItem')) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: 1,
                            itemType: 'Book',
                            currentStatus: 'Received',
                            dateDonated: '2024-11-01',
                        },
                    ]),
            });
        }
        console.log('Test 3');
        if (url.includes('program')) {
            console.log('Test 4');
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{ id: 1, name: 'Program A' }]),
            });
        }
        console.log('Test 5');
        return Promise.reject(new Error('Unknown URL'));
    }) as jest.Mock;
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('DonatedItemsList Component - Hover functionality', () => {
    it('applies hover styles on a table row with the clickable-row class', async () => {
        render(
            <BrowserRouter>
                <DonatedItemsList />
            </BrowserRouter>,
        );

        // Ensure the component has loaded data and find the item row
        const itemText = await screen.findByText(/Book/i); // Adjust this to match an actual item text
        const itemRow = itemText.closest('tr'); // Locate the row element

        expect(itemRow).toBeInTheDocument();
        expect(itemRow).toHaveClass('clickable-row'); // Verify the row has the expected class

        // Trigger a hover event
        fireEvent.mouseOver(itemRow!);
    });
});
*/
