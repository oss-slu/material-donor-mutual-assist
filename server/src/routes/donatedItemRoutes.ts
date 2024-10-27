import { Router, Request, Response } from 'express';
import multer from 'multer';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator'; // Import the validator
import { validateDonor } from '../services/donorService';
import { validateProgram } from '../services/programService';
import { uploadToStorage, getFileExtension } from '../services/donatedItemService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /donatedItem - Create a new DonatedItem
router.post('/', [upload.array('imageFiles'), donatedItemValidator], async (req: Request, res: Response) => {
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
                console.log('error', error)
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
        const imageUrls = await Promise.all(imageFiles.map(async (file) => {
            const fileExtension = getFileExtension(file.mimetype);
            const formattedDate = new Date().toISOString();
            return uploadToStorage(file, `item-${formattedDate}-${newItem.id}${fileExtension}`);
        }));

        const newStatus = await prisma.donatedItemStatus.create({
            data: {
                statusType: 'Received',
                dateModified: dateDonatedDateTime, // Use the same date as dateDonated
                donatedItemId: newItem.id,
                imageUrls: imageUrls
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
            try {
                await validateDonor(req.body.donorId);
                await validateProgram(req.body.programId);
            } catch (error) {
                if (error instanceof Error) {
                    return res.status(400).json({ error: error.message });
                }
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
