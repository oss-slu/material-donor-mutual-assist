import React from 'react';
import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import NewItemForm from '../Components/NewItemForm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NewItemForm', () => {
    beforeEach(() => {
        mockedAxios.get.mockReset();
        mockedAxios.post.mockReset();
    });

    test('fetches and displays donor emails and programs', async () => {
        const mockDonors = [
            { id: 1, firstName: 'John', email: 'john@example.com' },
            { id: 2, firstName: 'Jane', email: 'jane@example.com' },
        ];
        const mockPrograms = [
            { id: 1, name: 'Program A' },
            { id: 2, name: 'Program B' },
        ];

        mockedAxios.get.mockImplementation(url => {
            if (url.includes('/donor')) {
                return Promise.resolve({ data: mockDonors });
            } else if (url.includes('/program')) {
                return Promise.resolve({ data: mockPrograms });
            }
            return Promise.reject(new Error('Not found'));
        });

        await act(async () => {
            render(<NewItemForm />);
        });

        await waitFor(() => {
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
            expect(screen.getByText('jane@example.com')).toBeInTheDocument();
            expect(screen.getByText('Program A')).toBeInTheDocument();
            expect(screen.getByText('Program B')).toBeInTheDocument();
        });
    });

    test('submits form with correct data including Program and Donor IDs', async () => {
        mockedAxios.get.mockImplementation(url => {
            if (url.includes('/donor')) {
                return Promise.resolve({
                    data: [
                        { id: 1, firstName: 'John', email: 'john@example.com' },
                    ],
                });
            } else if (url.includes('/program')) {
                return Promise.resolve({
                    data: [{ id: 1, name: 'Program A' }],
                });
            }
            return Promise.reject(new Error('Not found'));
        });
        mockedAxios.post.mockResolvedValue({ status: 201 });

        await act(async () => {
            render(<NewItemForm />);
        });

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText(/Item Type/), {
                target: { value: 'Bicycle' },
            });
            fireEvent.change(screen.getByLabelText(/Donor Email/), {
                target: { value: 'john@example.com' },
            });
            fireEvent.change(screen.getByLabelText(/Program/), {
                target: { value: 'Program A' },
            });
            fireEvent.change(screen.getByLabelText(/Date Donated/), {
                target: { value: '2023-01-01' },
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
        });

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(FormData),
                expect.any(Object),
            );
            const calledFormData = mockedAxios.post.mock
                .calls[0][1] as FormData;
            expect(calledFormData.get('itemType')).toBe('Bicycle');
            expect(calledFormData.get('donorId')).toBe('1');
            expect(calledFormData.get('programId')).toBe('1');
            expect(calledFormData.get('dateDonated')).toBe('2023-01-01');
        });
    });

    test('form submission works without image upload', async () => {
        mockedAxios.get.mockImplementation(url => {
            if (url.includes('/donor')) {
                return Promise.resolve({
                    data: [
                        { id: 2, firstName: 'Jane', email: 'jane@example.com' },
                    ],
                });
            } else if (url.includes('/program')) {
                return Promise.resolve({
                    data: [{ id: 2, name: 'Program B' }],
                });
            }
            return Promise.reject(new Error('Not found'));
        });
        mockedAxios.post.mockResolvedValue({ status: 201 });

        await act(async () => {
            render(<NewItemForm />);
        });

        await waitFor(() => {
            fireEvent.change(screen.getByLabelText(/Item Type/), {
                target: { value: 'Computer' },
            });
            fireEvent.change(screen.getByLabelText(/Donor Email/), {
                target: { value: 'jane@example.com' },
            });
            fireEvent.change(screen.getByLabelText(/Program/), {
                target: { value: 'Program B' },
            });
            fireEvent.change(screen.getByLabelText(/Date Donated/), {
                target: { value: '2023-02-01' },
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
        });

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalled();
            const calledFormData = mockedAxios.post.mock
                .calls[0][1] as FormData;
            expect(calledFormData.get('images')).toBeFalsy();
        });
    });

    test('image upload preview and removal', async () => {
        mockedAxios.get.mockResolvedValue({ data: [] });

        await act(async () => {
            render(<NewItemForm />);
        });

        const file = new File(['dummy content'], 'test.png', {
            type: 'image/png',
        });
        const input = screen.getByLabelText(/Upload Images/i);

        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });

        await waitFor(() => {
            expect(screen.getByAltText('Preview 0')).toBeInTheDocument();
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Remove'));
        });

        await waitFor(() => {
            expect(screen.queryByAltText('Preview 0')).not.toBeInTheDocument();
        });
    });
});
