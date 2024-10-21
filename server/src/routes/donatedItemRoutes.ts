import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator'; // Import the validator
import { date } from 'joi';
import multer from 'multer';

const router = Router();

// Set up multer for file uploads
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Set limit for each file to 5 MB
});

// POST /donatedItem - Create a new DonatedItem
router.post(
    '/',
    upload.array('images', 5),
    donatedItemValidator,
    async (req: Request, res: Response) => {
        try {
            const { dateDonated, donorId, programId, ...rest } = req.body;
            // Convert donorId and programId to integers
            const donorIdInt = parseInt(donorId, 10);
            const programIdInt = parseInt(programId, 10);

            const dateDonatedDateTime = new Date(dateDonated);
            dateDonatedDateTime.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

            // Prepare an array to store image file paths or data
            const imagesData =
                (req.files as Express.Multer.File[])
                    ?.map((file: Express.Multer.File) => ({
                        url: file.path, // Assuming your Prisma image model has a `url` field
                    }))
                    .filter(image => image.url) || []; // Filter out any undefined or invalid image URLs

            // Prepare an array to store image file paths or data
            const imageUrls =
                (req.files as Express.Multer.File[])
                    ?.map((file: Express.Multer.File) => file.path) // Map file paths
                    .filter(url => url !== undefined) || []; // Filter out any undefined values

            const newItem = await prisma.donatedItem.create({
                data: {
                    ...rest, //spread the rest of the fields
                    dateDonated: dateDonatedDateTime,
                    donorId: donorIdInt, // Pass integer value
                    programId: programIdInt, // Pass integer value
                    imageUrls: imageUrls,
                    // dateDonated: new Date(dateDonated),
                    // dateDonated: new Date(dateDonated).setUTCHours(0,0,0,0), // Set time to 00:00:00 UTC
                },
            });
            console.log('Request Body:', req.body);
            console.log('Uploaded Files:', req.files);
            console.log('New donated item created:', newItem);
            res.status(201).json(newItem);
        } catch (error) {
            console.error('Error creating donated item:', error);
            res.status(500).json({ message: 'Error creating donated item' });
        }
    },
);

// GET /donatedItem - Fetch all donated items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await prisma.donatedItem.findMany({
            include: {
                statuses: true, // Include related status updates
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
