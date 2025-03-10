import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { body, validationResult } from 'express-validator';
import { sendPasswordReset } from '../services/emailService';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use secret from .env
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

router.post(
    '/forgotpassword',
    [body('email').isEmail().withMessage('Invalid email format')],
    async (req: Request, res: Response) => {
        const { email } = req.body;

        try {
            // Find user in the database
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    message: 'Email not found',
                });
            }

            // Generate JWT token and it expires in 1hr.
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1m' },
            );

            try {
                await sendPasswordReset(email, token);
                res.json({ message: 'Password reset email sent' });
            } catch (error) {
                console.error('Error sending reset email:', error);
                res.status(500).json({ message: 'Error sending email' });
            }
        } catch (error) {
            console.error('Server Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
);

router.post('/reset-password', async (req: Request, res: Response) => {
    const { token, password } = req.body;

    let decoded: JwtPayload;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Decode and verify the token
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({
                    message: 'Token has expired. Please request a new one.',
                });
        } else if (error.name === 'JsonWebTokenError') {
            return res
                .status(401)
                .json({
                    message:
                        'Invalid token. Please check the link or request a new one.',
                });
        } else {
            return res
                .status(401)
                .json({ message: 'Authentication failed. Please try again.' });
        }
    }

    const userId = decoded.userId;

    try {
        // Hash the password
        const newHashedPassword = await bcrypt.hash(password, 10);

        // Store user in database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: newHashedPassword }, // The new hashed password
        });

        return res.status(201).json({
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
