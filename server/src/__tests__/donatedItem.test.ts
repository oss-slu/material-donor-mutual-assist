import request from 'supertest';
import express from 'express';
import donatedItemRoutes from '../routes/donatedItemRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient';

const app = express();
app.use(express.json());
app.use('/donatedItem', donatedItemRoutes);

describe('DonatedItem API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test POST /donatedItem
    it('validates Program name and Donor email before creating a donated item', async () => {
        mockPrismaClient.program.findUnique.mockResolvedValue({ id: 1, name: 'Valid Program', description: 'Valid', startDate:'2024-10-04', aimAndCause:'recycle' });
        const newDonor = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            contact: '1234567890',
            addressLine1: '123 Main St',
            state: 'Missouri',
            city: 'St. Louis',
            zipcode: '63108',
            emailOptIn: false,
        };

        mockPrismaClient.donor.findUnique.mockResolvedValue({
            id: 1,
            ...newDonor,
        });
        const newItem = {
            itemType: 'Book',
            currentStatus: 'Received',
            programId: 1,
            donorId: 1,
            dateDonated: new Date().toISOString()
        };

        mockPrismaClient.donatedItem.create.mockResolvedValue({
            id: 1,
            ...newItem
        });

        const response = await request(app).post('/donatedItem').send(newItem);
        expect(response.status).toBe(201);
        expect(mockPrismaClient.donatedItem.create).toHaveBeenCalled();
    });

    it('handles errors when the provided Program or Donor does not exist', async () => {
        mockPrismaClient.program.findUnique.mockResolvedValue(null);
        mockPrismaClient.donor.findUnique.mockResolvedValue(null);

        const response = await request(app).post('/donatedItem').send({
            itemType: 'Book',
            currentStatus: 'Received',
            programId: 99,
            donorId: 29,
            dateDonated: new Date().toISOString()
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Donor ID is not valid or does not exist.');
    });

    // Test PUT /donatedItem/details/{id}
    it('updates donated item details correctly', async () => {
        mockPrismaClient.program.findUnique.mockResolvedValue({ id: 1, name: 'Valid Program', description: 'Valid', startDate:'2024-10-04', aimAndCause:'recycle' });
        const newDonor = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            contact: '1234567890',
            addressLine1: '123 Main St',
            state: 'Missouri',
            city: 'St. Louis',
            zipcode: '63108',
            emailOptIn: false,
        };

        mockPrismaClient.donor.findUnique.mockResolvedValue({
            id: 1,
            ...newDonor,
        });
        const updateData = {
            itemType: 'Updated Book',
            currentStatus: 'Received',
            programId: 1,
            donorId: 1,
            dateDonated: new Date().toISOString()
        };

        mockPrismaClient.donatedItem.update.mockResolvedValue({
            id: 1,
            ...updateData
        });

        const response = await request(app).put('/donatedItem/details/1').send(updateData);
        expect(response.status).toBe(200);
        expect(mockPrismaClient.donatedItem.update).toHaveBeenCalled();
        expect(response.body.itemType).toBe('Updated Book');
    });

    it('returns error responses for invalid Program or Donor values', async () => {
        mockPrismaClient.program.findUnique.mockResolvedValue(null);
        mockPrismaClient.donor.findUnique.mockResolvedValue(null);
        const donorId = 19;
        const programId = 99;

        const response = await request(app).put('/donatedItem/details/1').send({
            itemType: 'Books',
            currentStatus: 'Received',
            donorId: donorId,
            programId: programId,
            dateDonated: new Date().toISOString()
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain(`Donor with ID: ${donorId} does not exist.`);
    });
});
