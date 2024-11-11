import { Router, Request, Response } from 'express';
import multer from 'multer';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator'; // Import the validator
import { validateDonor } from '../services/donorService';
import { validateProgram } from '../services/programService';
import { validateDonatedItem } from '../services/donatedItemService';
import {
    uploadToStorage,
    getFileExtension,
} from '../services/donatedItemService';
import { date } from 'joi';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /donatedItem - Create a new DonatedItem
router.post(
    '/',
    [upload.array('imageFiles'), donatedItemValidator],
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const donorId = parseInt(req.body.donorId);
            const programId = parseInt(req.body.programId);
            const { dateDonated, ...rest } = req.body;

            try {
                await validateDonor(donorId);
                await validateProgram(programId);
            } catch (error) {
                if (error instanceof Error) {
                    console.log('error', error);
                    return res.status(400).json({ error: error.message });
                }
            }
            const dateDonatedDateTime = new Date(dateDonated);
            dateDonatedDateTime.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

            const newItem = await prisma.donatedItem.create({
                data: {
                    ...rest, //spread the rest of the fields
                    donorId,
                    programId,
                    dateDonated: dateDonatedDateTime,
                },
            });

            // Upload images to cloud storage and get their filenames
            const imageUrls = await Promise.all(
                imageFiles.map(async file => {
                    const fileExtension = getFileExtension(file.mimetype);
                    const formattedDate = new Date().toISOString();
                    return uploadToStorage(
                        file,
                        `item-${formattedDate}-${newItem.id}${fileExtension}`,
                    );
                }),
            );

            const newStatus = await prisma.donatedItemStatus.create({
                data: {
                    statusType: 'Received',
                    dateModified: dateDonatedDateTime, // Use the same date as dateDonated
                    donatedItemId: newItem.id,
                    imageUrls: imageUrls,
                },
            });

            res.status(201).json({
                donatedItem: newItem,
                donatedItemStatus: newStatus,
            });
        } catch (error) {
            console.error('Error creating donated item:', error);
            res.status(500).json({ message: 'Error creating donated item' });
        }
    },
);

// GET /donatedItem - Fetch all donated items
router.get('/', async (req: Request, res: Response) => {
    try {
        const donatedItems = await prisma.donatedItem.findMany({
            include: {
                donor: true, // Include all donor details
                program: true, // Include all program details
                statuses: {
                    orderBy: {
                        dateModified: 'asc', // Ensure they are ordered chronologically
                    },
                },
            },
        });
        res.json(donatedItems);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching donated item:', error.message);
            res.status(
                error.message.includes('must be an integer') ? 400 : 404,
            ).json({ error: error.message });
        } else {
            console.error('Error fetching donated item:', 'Unknown error');
            res.status(500).json({ error: 'Unknown error' });
        }
    }
});

// GET /donatedItem - Fetch donated item by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const donatedItemId = parseInt(req.params.id);
        await validateDonatedItem(donatedItemId);
        const donatedItem = await prisma.donatedItem.findUnique({
            where: { id: donatedItemId },
            include: {
                donor: true, // Include all donor details
                program: true, // Include all program details
                statuses: {
                    orderBy: {
                        dateModified: 'asc', // Ensure they are ordered chronologically
                    },
                },
            },
        });

        if (!donatedItem) {
            return res
                .status(404)
                .json({
                    error: `Donated item with ID ${donatedItemId} not found`,
                });
        }
        res.json(donatedItem);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching donated item:', error.message);
            res.status(
                error.message.includes('must be an integer') ? 400 : 404,
            ).json({ error: error.message });
        } else {
            console.error('Error fetching donated item:', 'Unknown error');
            res.status(500).json({ error: 'Unknown error' });
        }
    }
});

// PUT /donatedItem/status/:id - Update the status of a DonatedItem and handle image uploads
router.put(
    '/status/:id',
    upload.array('imageFiles'), // Handle image files as multipart
    async (req: Request, res: Response) => {
        try {
            const donatedItemId = parseInt(req.params.id);

            // Validate donated item ID
            await validateDonatedItem(donatedItemId);

            // Extract status details and image files
            const { statusType, dateModified } = req.body;
            const imageFiles = req.files as Express.Multer.File[];

            // Ensure statusType and dateModified are provided
            if (!statusType || !dateModified) {
                return res
                    .status(400)
                    .json({ error: 'statusType and dateModified are required' });
            }

            // Convert dateModified to a Date object
            const dateModifiedDateTime = new Date(dateModified);
            dateModifiedDateTime.setUTCHours(0, 0, 0, 0); // Normalize time to UTC

            // Upload images to cloud storage and retrieve URLs
            const imageUrls = await Promise.all(
                imageFiles.map(async file => {
                    const fileExtension = getFileExtension(file.mimetype);
                    const formattedDate = new Date().toISOString();
                    return uploadToStorage(
                        file,
                        `status-${formattedDate}-${donatedItemId}${fileExtension}`,
                    );
                }),
            );

            // Update the status record in the database
            const updatedStatus = await prisma.donatedItemStatus.update({
                where: { id: donatedItemId }, // Assuming 1-to-1 relationship for simplicity
                data: {
                    statusType,
                    dateModified: dateModifiedDateTime,
                    imageUrls,
                },
            });

            // Return updated status details
            res.status(200).json({
                message: 'Donated item status updated successfully',
                status: updatedStatus,
            });
        } catch (error) {
            console.error('Error updating donated item status:', error);

            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({
                    message: 'Error updating donated item status',
                });
            }
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
