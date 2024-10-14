import request from 'supertest';
import express from 'express';
import donatedItemRoutes from '../routes/donatedItemRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient';
import { newProgram } from '../__mocks__/mockProgram';
import { newDonor } from '../__mocks__/mockDonor';
import { newItem } from '../__mocks__/mockNewItem';
import { updateData } from '../__mocks__/mockUpdateData';

const app = express();
app.use(express.json());
app.use('/donatedItem', donatedItemRoutes);

describe('DonatedItem API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup mock responses
        mockPrismaClient.program.findUnique.mockResolvedValue(newProgram);
        mockPrismaClient.donor.findUnique.mockResolvedValue(newDonor);
        mockPrismaClient.donatedItem.create.mockResolvedValue({ id: 1, ...newItem });
        mockPrismaClient.donatedItem.update.mockResolvedValue({ id: 1, ...updateData });
    });

    // Test POST /donatedItem
    it('validates Program name and Donor email before creating a donated item', async () => {
        const response = await request(app).post('/donatedItem').send(newItem);
        expect(response.status).toBe(201);
        expect(mockPrismaClient.donatedItem.create).toHaveBeenCalled();
    
    });

    it('handles errors when the provided Program or Donor does not exist', async () => {
        const programId = 99; 
        const donorId = 29;
        mockPrismaClient.program.findUnique.mockResolvedValue(null);
        mockPrismaClient.donor.findUnique.mockResolvedValue(null);
    
        const response = await request(app).post('/donatedItem').send({
            ...newItem,
            programId,
            donorId,
            dateDonated: new Date().toISOString()
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain(`Donor with ID: ${donorId} does not exist.`);

    });

    // Test PUT /donatedItem/details/{id}
    it('updates donated item details correctly', async () => {
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
            ...updateData,
            donorId,
            programId
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toContain(`Donor with ID: ${donorId} does not exist.`);
    });
});
