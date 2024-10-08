import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemStatusValidator } from '../validators/donatedItemStatusValidator'; // Import the validator

const router = Router();

// PUT /donatedItem/status/:id - Update the status of a DonatedItem
router.put(
    '/:id',
    donatedItemStatusValidator,
    async (req: Request, res: Response) => {
        try {
            const { statusType, dateModified } = req.body;

            // Update the donated item's current status and lastUpdated fields
            const updatedStatus = await prisma.donatedItem.update({
                where: { id: Number(req.params.id) },
                data: {
                    currentStatus: statusType,
                    lastUpdated: new Date(),
                },
            });

            // Create a new entry in DonatedItemStatus to track the status change
            const newStatus = await prisma.donatedItemStatus.create({
                data: {
                    statusType: statusType,
                    dateModified: dateModified
                        ? new Date(dateModified)
                        : new Date(),
                    donatedItemId: Number(req.params.id),
                },
            });

            console.log('Donated item status updated:', updatedStatus);
            res.json({ updatedStatus, newStatus });
        } catch (error) {
            console.error('Error updating donated item status:', error);
            res.status(500).json({
                message: 'Error updating donated item status',
            });
        }
    },
);

export default router;
