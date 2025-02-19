import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donorValidator } from '../validators/donorValidator';
import { sendWelcomeEmail } from '../services/emailService';

const router = Router();

router.post('/', donorValidator, async (req: Request, res: Response) => {
    try {
        const newDonor = await prisma.donor.create({
            data: req.body,
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

router.get('/', async (req: Request, res: Response) => {
    try {
        const donors = await prisma.donor.findMany();
        res.json(donors);
    } catch (error) {
        console.log('Error fetching donor:', error);
        res.status(500).json({ message: 'Error fetching donors' });
    }
});

export default router;
