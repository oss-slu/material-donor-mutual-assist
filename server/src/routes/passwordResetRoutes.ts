import { Router, Request, Response } from 'express';
import prisma from '../prismaClient'; // Import Prisma client
import { body, validationResult } from 'express-validator';
import { sendPasswordReset } from '../services/emailService';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
                { expiresIn: '1h' },
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

    try {
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as JwtPayload; // Decode and verify the token
        } catch (error) {
            return res
                .status(401)
                .json({ message: 'Invalid or expired token' });
        }

        const userId = decoded.userId;

        try {
            // Hash the password
            const newHashedPassword = await bcrypt.hash(password, 10);

        // Store new password in database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: newHashedPassword }, // The new hashed password
        });

            return res.status(201).json({
                message: 'Password changed successfully',
            });
        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } catch (jwtError) {
        try {
            console.log(
                'Not a valid JWT, trying first login hashed token flow...',
            );

            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await prisma.user.findFirst({
                where: {
                    resetToken: hashedToken,
                    resetTokenExpiry: { gte: new Date() },
                },
            });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'Invalid or expired reset token' });
            }

            if (user.firstLogin && user.role === 'DONOR') {
                const newHashedPassword = await bcrypt.hash(password, 10);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        password: newHashedPassword,
                        resetToken: null,
                        resetTokenExpiry: null,
                        firstLogin: false, // Mark as completed
                    },
                });

                return res
                    .status(200)
                    .json({ message: 'Password reset successful' });
            } else {
                return res
                    .status(403)
                    .json({ message: 'Reset not allowed for this user' });
            }
        } catch (dbError) {
            console.error('Error during first login token flow:', dbError);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
});

export default router;
