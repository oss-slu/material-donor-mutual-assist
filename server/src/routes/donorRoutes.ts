import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donorValidator } from '../validators/donorValidator';
import multer from 'multer'; // Import multer for handling file uploads

const router = Router();

// File upload validation
const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFileTypes = /jpeg|jpg|png/; // Allowed image file extensions
    const isFileTypeValid = allowedFileTypes.test(file.mimetype);
    
    if (!isFileTypeValid) {
        return cb(new Error('Only JPEG, JPG, and PNG files are allowed'), false);
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB size limit
        return cb(new Error('File size should be less than 5MB'), false);
    }

    cb(null, true);
};

// Multer storage configuration
const storage = multer.memoryStorage(); // Store files in memory (you could change this to diskStorage if needed)
const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { files: 5 } // Limit to 5 files per upload
});

// POST route for creating a new donor with image uploads (5 max images)
router.post('/', upload.array('images', 5), donorValidator, async (req: Request, res: Response) => {
    try {
        // Here, we assume the images are part of the donor data, but you may want to store them differently.
        const newDonor = await prisma.donor.create({
            data: {
                ...req.body,
                images: req.files, // Store image data in the database (ensure the model has a field for this)
            },
        });
        console.log('New donor created with images:', newDonor);
        res.status(201).json(newDonor);
    } catch (error) {
        console.error('Error creating donor:', error);
        res.status(500).json({ message: 'Error creating donor' });
    }
});

// GET route for fetching donors
router.get('/', async (req: Request, res: Response) => {
    try {
        const donors = await prisma.donor.findMany();
        res.json(donors);
    } catch (error) {
        console.error('Error fetching donor:', error);
        res.status(500).json({ message: 'Error fetching donors' });
    }
});

export default router;
