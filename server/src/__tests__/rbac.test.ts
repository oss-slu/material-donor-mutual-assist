import request from 'supertest';
import express, { Express } from 'express';
import { authenticateUser } from '../routes/routeProtection';
import donorRouter from '../routes/donorRoutes';
import mockPrismaClient from '../__mocks__/mockPrismaClient'; // Mock Prisma
import jwt from 'jsonwebtoken';

const generateTestToken = (role: string = 'ADMIN', expired: boolean) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'xalngJIazn';
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in .env file!');
    }
    if (expired) {
        return jwt.sign(
            { id: 1, email: 'john@example.com', role },
            JWT_SECRET,
            {
                expiresIn: '-1m',
            },
        );
    } else {
        return jwt.sign(
            { id: 1, email: 'john@example.com', role },
            JWT_SECRET,
            {
                expiresIn: '1h',
            },
        );
    }
};

const app: Express = express();
app.use(express.json());
app.use('/donor', donorRouter);

describe('General Role Based Access', () => {
    let req: any;
    let res: any;
    let donorToken: string;
    let adminToken: string;
    let compromisedToken: string;
    let expiredToken: string;
    beforeAll(() => {
        donorToken = generateTestToken('DONOR', false);
        adminToken = generateTestToken('ADMIN', false);
    });

    beforeEach(() => {
        req = {
            headers: {
                authorization: '',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('blocks users who are not signed in', async () => {
        req.headers.authorization = undefined;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access denied: Not logged in',
        });
        expect(result).toBe(false);
    });

    it('blocks donors from accessing admin pages', async () => {
        req.headers.authorization = donorToken;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access denied: Insufficient permissions',
        });
        expect(result).toBe(false);
    });

    it('blocks compromised tokens', async () => {
        compromisedToken = adminToken + 'k';
        req.headers.authorization = compromisedToken;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
        expect(result).toBe(false);
    });

    it('blocks expired tokens', async () => {
        expiredToken = generateTestToken('ADMIN', true);
        req.headers.authorization = expiredToken;

        const result = await authenticateUser(req, res, true);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Internal server error',
        });
        expect(result).toBe(false);
    });

    it('allows for admins to access admin pages', async () => {
        req.headers.authorization = adminToken;

        const result = await authenticateUser(req, res, true);

        expect(result).toBe(true);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});

describe('Donor List RBAC', () => {
    let donorToken: string;
    let adminToken: string;
    beforeAll(() => {
        donorToken = generateTestToken('DONOR', false);
        adminToken = generateTestToken('ADMIN', false);
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
    it('loads donor list for admins', async () => {
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
            .set('Authorization', adminToken)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].firstName).toBe('John');
        expect(mockPrismaClient.donor.findMany).toHaveBeenCalled();
    });
});
