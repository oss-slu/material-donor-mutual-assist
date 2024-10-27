import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import {DonatedItemsList} from '../Components/DonatedItemsList';

import { BrowserRouter } from 'react-router-dom';

// Mock the react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock data
const mockDonatedItems = [
    {
        id: 1,
        itemType: 'Bicycle',
        currentStatus: 'Received',
        dateDonated: '2024-01-01',
        donor: { id: 1, firstName: 'John Doe', email: 'john@example.com' },
        program: { id: 1, name: 'Program A' },
    },
    {
        id: 2,
        itemType: 'Computer',
        currentStatus: 'In Storage',
        dateDonated: '2024-02-01',
        donor: { id: 2, firstName: 'Jane Smith', email: 'jane@example.com' },
        program: { id: 2, name: 'Program B' },
    },
];

const mockProgramOptions = [
    { id: 1, name: 'Program A' },
    { id: 2, name: 'Program B' },
];

// Setup fetch mock
global.fetch = jest.fn();

describe('DonatedItemsList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to setup fetch mocks
    const setupFetchMocks = (
        donatedItems = mockDonatedItems,
        programs = mockProgramOptions,
    ) => {
        (global.fetch as jest.Mock).mockImplementation(url => {
            if (url.includes('/donatedItem')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(donatedItems),
                });
            }
            if (url.includes('/program')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(programs),
                });
            }
            return Promise.reject(new Error('not found'));
        });
    };

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <DonatedItemsList />
            </BrowserRouter>,
        );
    };

    describe('Data Fetching and Display', () => {
        test('successfully fetches and displays donated items', async () => {
            setupFetchMocks();
            renderComponent();

            // Check loading state
            expect(screen.getByText('Loading...')).toBeInTheDocument();

            // Wait for data to load and verify table content
            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
                expect(screen.getByText('Computer')).toBeInTheDocument();
            });

            // Verify donor names are displayed correctly
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();

            // Verify programs are displayed
            expect(screen.getByText('Program A')).toBeInTheDocument();
            expect(screen.getByText('Program B')).toBeInTheDocument();
        });

        test('handles API error gracefully', async () => {
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error('API Error'),
            );
            renderComponent();

            await waitFor(() => {
                expect(screen.getByText(/Error:/)).toBeInTheDocument();
            });
        });

        test('handles empty data set correctly', async () => {
            setupFetchMocks([], []);
            renderComponent();

            await waitFor(() => {
                const table = screen.getByRole('table');
                const tbody = table.querySelector('tbody');
                expect(tbody?.children.length).toBe(0);
            });
        });
    });

    describe('Filtering Functionality', () => {
        beforeEach(() => {
            setupFetchMocks();
        });

        test('filters items by search input', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText(/Search using/i);
            const searchButton = screen.getByRole('button', {
                name: /search/i,
            });

            fireEvent.change(searchInput, { target: { value: 'Bicycle' } });
            fireEvent.click(searchButton);

            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows.length).toBe(2); // Header row + 1 data row
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
                expect(screen.queryByText('Computer')).not.toBeInTheDocument();
            });
        });

        test('filters items by item type', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
            });

            const filterSelect = screen.getByRole('combobox', {
                name: /Filter by Item Type/i,
            });
            fireEvent.change(filterSelect, { target: { value: 'Bicycle' } });

            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
                expect(screen.queryByText('Computer')).not.toBeInTheDocument();
            });
        });

        test('filters items by program', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Program A')).toBeInTheDocument();
            });

            const filterSelect = screen.getByRole('combobox', {
                name: /Filter by Program/i,
            });
            fireEvent.change(filterSelect, { target: { value: '1' } });

            await waitFor(() => {
                expect(screen.getByText('Program A')).toBeInTheDocument();
                expect(screen.queryByText('Program B')).not.toBeInTheDocument();
            });
        });

        test('filters items by status', async () => {
            renderComponent();
            await waitFor(() => {
                expect(screen.getByText('Received')).toBeInTheDocument();
            });

            const filterSelect = screen.getByRole('combobox', {
                name: /Filter by Status/i,
            });
            fireEvent.change(filterSelect, { target: { value: 'Received' } });

            await waitFor(() => {
                expect(screen.getByText('Received')).toBeInTheDocument();
                expect(
                    screen.queryByText('In Storage'),
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('Sorting Functionality', () => {
        test('sorts items by date in ascending order', async () => {
            setupFetchMocks();
            renderComponent();

            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
            });

            const sortSelect = screen.getByRole('combobox', { name: /Sort/i });
            fireEvent.change(sortSelect, { target: { value: 'dateAsc' } });

            const rows = screen.getAllByRole('row');
            const firstItemDate = within(rows[1]).getByText('1/1/2024');
            const secondItemDate = within(rows[2]).getByText('2/1/2024');

            expect(firstItemDate).toBeInTheDocument();
            expect(secondItemDate).toBeInTheDocument();
        });

        test('sorts items by date in descending order', async () => {
            setupFetchMocks();
            renderComponent();

            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
            });

            const sortSelect = screen.getByRole('combobox', { name: /Sort/i });
            fireEvent.change(sortSelect, { target: { value: 'dateDesc' } });

            const rows = screen.getAllByRole('row');
            const firstItemDate = within(rows[1]).getByText('2/1/2024');
            const secondItemDate = within(rows[2]).getByText('1/1/2024');

            expect(firstItemDate).toBeInTheDocument();
            expect(secondItemDate).toBeInTheDocument();
        });
    });

    describe('Program Assignment', () => {
        test('displays checkbox column when assign program is clicked', async () => {
            setupFetchMocks();
            renderComponent();

            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
            });

            const assignProgramButton = screen.getByText('Assign Program');
            fireEvent.click(assignProgramButton);

            expect(screen.getByText('Select')).toBeInTheDocument();
            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes.length).toBe(mockDonatedItems.length);
        });

        test('updates program for selected items', async () => {
            setupFetchMocks();
            renderComponent();

            await waitFor(() => {
                expect(screen.getByText('Bicycle')).toBeInTheDocument();
            });

            // Click assign program button
            fireEvent.click(screen.getByText('Assign Program'));

            // Select an item
            const checkbox = screen.getAllByRole('checkbox')[0];
            fireEvent.click(checkbox);

            // Select a program
            const programSelect = screen.getByRole('combobox', {
                name: /Select Program/i,
            });
            fireEvent.change(programSelect, { target: { value: '1' } });

            // Mock the PUT request
            (global.fetch as jest.Mock).mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                }),
            );

            // Click update button
            fireEvent.click(screen.getByText('Update Programs'));

            // Verify the fetch was called with correct parameters
            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    'http://localhost:4000/program',
                    expect.objectContaining({
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: expect.any(String),
                    }),
                );
            });
        });
    });

    describe('Navigation', () => {
        test('navigates to add donation page when add button is clicked', async () => {
            setupFetchMocks();
            renderComponent();

            await waitFor(() => {
                expect(
                    screen.getByText('Add New Donation'),
                ).toBeInTheDocument();
            });

            fireEvent.click(screen.getByText('Add New Donation'));
            expect(mockNavigate).toHaveBeenCalledWith('/adddonation');
        });
    });
});
