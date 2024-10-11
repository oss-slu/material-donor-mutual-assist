import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator'; // Import the validator
import { date } from 'joi';

const router = Router();

// POST /donatedItem - Create a new DonatedItem
router.post('/', donatedItemValidator, async (req: Request, res: Response) => {
    try {
        const { dateDonated, ...rest } = req.body;

        const dateDonatedDateTime = new Date(dateDonated);
        dateDonatedDateTime.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

        const newItem = await prisma.donatedItem.create({
            data: {
                ...rest, //spread the rest of the fields
                dateDonated: dateDonatedDateTime,
                // dateDonated: new Date(dateDonated),
                // dateDonated: new Date(dateDonated).setUTCHours(0,0,0,0), // Set time to 00:00:00 UTC
            },
        });
        console.log('New donated item created:', newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating donated item:', error);
        res.status(500).json({ message: 'Error creating donated item' });
    }
});

// GET /donatedItem - Fetch all donated items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await prisma.donatedItem.findMany({
            include: {
                statuses: true, // Include related status updates
                program:true,
                donor:true,
            },
        });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching donated items' });
    }
});

// PUT /donatedItem/details/:id - Update non-status details of a DonatedItem
router.put(
    '/details/:id',
    donatedItemValidator,
    async (req: Request, res: Response) => {
        try {
            // Validate Donor ID
            const donor = await prisma.donor.findUnique({
                where: { id: req.body.donorId }
            });

            if (!donor) {
                return res.status(400).json({ error: `Donor with ID: ${req.body.donorId} does not exist.` });
            }

            // Validate Program ID
            const program = await prisma.program.findUnique({
                where: { id: req.body.programId }
            });

            if (!program) {
                return res.status(400).json({ error: `No program found with the ID: ${req.body.programId}` });
            }

            const updatedItem = await prisma.donatedItem.update({
                where: { id: Number(req.params.id) },
                data: { ...req.body, lastUpdated: new Date() },
            });
            console.log('Donated item updated:', updatedItem);
            res.json(updatedItem);
        } catch (error) {
            console.error('Error updating donated item details:', error);
            res.status(500).json({
                message: 'Error updating donated item details',
            });
        }
    },
);

//Added cascade deletion of statuses
// DELETE /donatedItem/:id - Delete a DonatedItem with cascading deletion of its statuses
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedItem = await prisma.donatedItem.delete({
            where: { id: Number(req.params.id) },
        });
        console.log('Donated item deleted:', deletedItem);
        res.status(200).json(deletedItem);
    } catch (error) {
        console.error('Error deleting donated item:', error);
        res.status(500).json({ message: 'Error deleting donated item' });
    }
});

export default router;
