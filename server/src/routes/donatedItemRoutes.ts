import { Router, Request, Response } from 'express';
import multer from 'multer';
import prisma from '../prismaClient'; // Import Prisma client
import { donatedItemValidator } from '../validators/donatedItemValidator'; // Import the validator
import { validateDonor } from '../services/donorService';
import { validateProgram } from '../services/programService';
import {
    fetchImagesFromCloud,
    validateDonatedItem,
} from '../services/donatedItemService';
import {
    uploadToStorage,
    getFileExtension,
} from '../services/donatedItemService';
import { DonatedItemStatus } from '../modals/DonatedItemStatusModal';

const router = Router();

// Configure multer storage
const storage = multer.memoryStorage();

// Define file validation rules
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/; // Allowed image file extensions
    const extname = allowedFileTypes.test(file.mimetype);
    const mimetype = allowedFileTypes.test(file.originalname.toLowerCase());

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.'));
    }
};

// Configure multer with file size limit and max number of files
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5, // Limit to 5 files
    },
    fileFilter: fileFilter,
});

// POST /donatedItem - Create a new DonatedItem
router.post(
    '/',
    [upload.array('imageFiles'), donatedItemValidator], // Add multer as middleware
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const donorId = parseInt(req.body.donorId);
            const programId = parseInt(req.body.programId);
            const { dateDonated, ...rest } = req.body;

            // Validate donor and program
            try {
                await validateDonor(donorId);
                await validateProgram(programId);
            } catch (error) {
                if (error instanceof Error) {
                    console.log('error', error);
                    return res.status(400).json({ error: error.message });
                }
            }

            // Validate date
            const dateDonatedDateTime = new Date(dateDonated);
            dateDonatedDateTime.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

            // Create a new donated item
            const newItem = await prisma.donatedItem.create({
                data: {
                    ...rest, //spread the rest of the fields
                    donorId,
                    programId,
                    dateDonated: dateDonatedDateTime,
                },
            });

            // If there are no image files, send a validation error
            if (!imageFiles || imageFiles.length === 0) {
                return res.status(400).json({ error: 'At least one image is required.' });
            }

            // Upload images to cloud storage and get their filenames
            const imageUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const fileExtension = getFileExtension(file.mimetype);
                    const formattedDate = new Date().toISOString();
                    return uploadToStorage(
                        file,
                        `item-${formattedDate}-${newItem.id}${fileExtension}`,
                    );
                })
            );

            // Create new status for the donated item
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
    }
);

export default router;
