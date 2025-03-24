// backend/routes/program.ts
import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Assuming prismaClient is configured for DB
import { authenticateAdmin } from '../middlewares/authMiddleware'; // Admin authentication middleware

const router = Router();

// PUT /api/program/:id - Update program details (Admin only)
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
        const programId = parseInt(req.params.id); // Program ID from the URL
        const { name, description, funding } = req.body; // Data to be updated

        // Input validation
        if (!name || !description || !funding) {
            return res.status(400).json({ error: 'All fields (name, description, funding) are required' });
        }

        // Update program in the database using Prisma
        const updatedProgram = await prisma.program.update({
            where: { id: programId },
            data: {
                name, // Program name
                description, // Program description
                funding, // Program funding
                updatedAt: new Date() // Timestamp when updated
            },
        });

        res.json(updatedProgram); // Send back the updated program details
    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
