import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donorValidator } from '../validators/donorValidator';
import { sendWelcomeEmail } from '../services/emailService';
import express from 'express';
import { authenticateUser, authorizeAdmin } from '../authRoutes';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/', donorValidator, async (req: Request, res: Response) => {
    try {
        const newDonor = await prisma.donor.create({
            data: {
            ...req.body, 
            role : 'USER',
            }
        });
        console.log('New donor created:', newDonor);

        // Send a welcome email asynchronously
        try {
            await sendWelcomeEmail(
                newDonor.email,
                `${newDonor.firstName} ${newDonor.lastName}`,
            );
            console.log('Welcome email sent successfully');
        } catch (emailError) {
            console.log('Failed to send welcome email:', emailError);
        }

        res.status(201).json(newDonor);
    } catch (error) {
        console.log('Error creating donor:', error);
        res.status(500).json({ message: 'Error creating donor' });
    }
});

//router.get('/', authenticateUser, authorizeAdmin, async (req: Request, res: Response) => {
router.get('/', async (req: Request, res: Response) => {
    try {
        const donors = await prisma.donor.findMany();
        res.json(donors);
    } catch (error) {
        console.log('Error fetching donor:', error);
        res.status(500).json({ message: 'Error fetching donors' });
    }
});

function getRandomPassword() {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$&+,:;=?@#|'<>.^*()%!-";
    let valid = false;
    let password = '';
    const indicies = new Uint8Array(16);
    while (!valid) {
        password = '';
        crypto.getRandomValues(indicies);
        for (const i of indicies) {
            password += charset[i % charset.length];
        }
        valid =
            password.match(/[$&+,:;=?@#|'<>.^*()%!-]/) != null &&
            password.match(/[A-Z]/) != null &&
            password.match(/[a-z]/) != null &&
            password.match(/[0-9]/) != null;
    }
    return password;
}
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const donorPassword = getRandomPassword();
        const hashedPassword = await bcrypt.hash(donorPassword, 10);

        // Store user in database
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, role: 'USER' },
        });

        return res.status(201).json({
            message: 'User registered successfully',
            userId: user.id,
            password: donorPassword,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering donor' });
    }
});

export default router;
