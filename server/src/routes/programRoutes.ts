import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client

const router = Router();

// Route to create a new program
router.post('/', async (req: Request, res: Response) => {
    try {
        const newProgram = await prisma.program.create({
            data: req.body,
        });
        console.log('New program created:', newProgram);
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
