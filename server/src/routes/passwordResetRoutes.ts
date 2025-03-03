import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { donorValidator } from '../validators/donorValidator';
import { body, validationResult } from 'express-validator';
import { sendPasswordReset } from '../services/emailService';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use secret from .env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

router.post(
    '/forgotpassword',
    [
        body('email').isEmail().withMessage('Invalid email format'),
    ],
    async (req: Request, res: Response) => {
        const { email } = req.body;
    
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
    
    
        try {
            await sendPasswordReset(email, "1");
            res.json({ message: 'Password reset email sent' });
        } catch (error) {
            console.error('Error sending reset email:', error);
            res.status(500).json({ message: 'Error sending email' });
        }
    }
);

// router.post('/forgotpassword', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: 'Email is required' });
//     }


//     try {
//         await sendPasswordReset(email, "1");
//         res.json({ message: 'Password reset email sent' });
//     } catch (error) {
//         console.error('Error sending reset email:', error);
//         res.status(500).json({ message: 'Error sending email' });
//     }
// });

export default router;