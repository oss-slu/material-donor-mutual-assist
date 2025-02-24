import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use secret from .env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

// Route to register a new user
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: 'Email already in use' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Store user in database
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
            });

            return res.status(201).json({
                message: 'User registered successfully',
                userId: user.id,
            });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

// Route to login user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Find user in the database
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    message:
                        'Invalid email, please register to proceed with login.',
                });
            }

            // Compare passwords using bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password.' });
            }

            // Generate JWT token and it expires in 1hr.
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' },
            );

            return res.status(200).json({ message: 'Login successful', token, name: user.name });
        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

// Route to create a new program
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description, startDate, aimAndCause } = req.body;

        // Convert the date to include time (e.g., "YYYY-MM-DDT00:00:00Z")
        const dateTime = new Date(`${startDate}T00:00:00Z`);

        // Create the new program with the full DateTime for startDate
        const newProgram = await prisma.program.create({
            data: {
                name,
                description,
                startDate: dateTime, // Pass the DateTime to backend
                aimAndCause,
            },
        });
        res.status(201).json(newProgram);
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ message: 'Error creating program' });
    }
});

// Route to get all programs
router.get('/', async (req: Request, res: Response) => {
    try {
        const programs = await prisma.program.findMany();
        res.json(programs);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ message: 'Error fetching programs' });
    }
});

export default router;
