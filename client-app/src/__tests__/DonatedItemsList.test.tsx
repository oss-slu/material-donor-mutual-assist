import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
                        id: 5,
                        itemType: 'Book',
                        currentStatus: 'Received',
                        dateDonated: '2024-11-01',
                    },
                    {
                        id: 15,
                        itemType: 'Chair',
                        currentStatus: 'Received',
                        dateDonated: '2024-11-02',
                    },
                    {
                        id: 25,
                        itemType: 'Bike',
                        currentStatus: 'Received',
                        dateDonated: '2024-11-03',
                    },
                    {
                        id: 50,
                        itemType: 'Computer',
                        currentStatus: 'Received',
                        dateDonated: '2024-11-04',
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

it('returns only the exact item ID for numeric searches', async () => {
    render(
        <BrowserRouter>
            <DonatedItemsList />
        </BrowserRouter>,
    );

    await screen.findByText('Book');

    const searchInput = screen.getByPlaceholderText(
        'Search using Item Id, Name, or Donor',
    );

    fireEvent.change(searchInput, {
        target: { value: '5' },
    });

    fireEvent.click(
        screen.getByRole('button', {
            name: /^search\b/i,
        }),
    );

    await waitFor(() => {
        const item5Row = screen.getByText('5').closest('tr');
        const item15Row = screen.getByText('15').closest('tr');
        const item25Row = screen.getByText('25').closest('tr');
        const item50Row = screen.getByText('50').closest('tr');

        expect(item5Row).toBeVisible();
        expect(item15Row).not.toBeVisible();
        expect(item25Row).not.toBeVisible();
        expect(item50Row).not.toBeVisible();
    });
});
