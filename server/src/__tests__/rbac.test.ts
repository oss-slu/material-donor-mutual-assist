import request from 'supertest';
import express, { Express } from 'express';
import donorRouter from '../routes/donorRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient'; // Mock Prisma
import jwt from 'jsonwebtoken';

const generateTestToken = (role: string = 'ADMIN') => {
    const JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in .env file!');
    }
    return jwt.sign({ id: 1, email: 'john@example.com', role }, JWT_SECRET, {
        expiresIn: '1h',
    });
};

const app: Express = express();
app.use(express.json());
app.use('/donor', donorRouter);

describe('Donor List RBAC', () => {
    let donorToken: string;
    beforeAll(() => {
        donorToken = generateTestToken('DONOR');
    });
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test to avoid interference
    });
    it('blocks donors from retrieving donor list', async () => {
        mockPrismaClient.donor.findMany.mockResolvedValue([
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
            },
        ]);

        const response = await request(app)
            .get('/donor')
            .set('Authorization', donorToken)
            .expect(401)
            .expect('Content-Type', /json/);

        expect(response.body.message).toBe(
            'Access denied: Insufficient permissions',
        );
    });
    it('blocks donor list if not logged in', async () => {
        mockPrismaClient.donor.findMany.mockResolvedValue([
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
            },
        ]);

        const response = await request(app)
            .get('/donor')
            .expect(401)
            .expect('Content-Type', /json/);

        expect(response.body.message).toBe('Access denied: Not logged in');
    });
});
