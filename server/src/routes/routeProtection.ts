import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // MIGHT NOT BE NEEDED

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

export const authenticateUser = async (
    req: Request,
    res: Response,
    adminPerm: Boolean,
) => {
    // const authHeader = req.headers.authorization;
    console.log('Checkpoint 2');
    try {
        const authHeader = req.headers.authorization;
        console.log('Checkpoint 3');
        if (!authHeader) {
            //throw new Error("Access denied: Not logged in");
            console.log('Checkpoint 4');
            res.status(401).json({ message: 'Access denied: Not logged in' });
            return false;
        }
        console.log('Checkpoint 5');
        const decoded = jwt.verify(authHeader, JWT_SECRET) as { role: string };
        if (decoded.role != 'ADMIN' && adminPerm) {
            return res
                .status(401)
                .json({ message: 'Access denied: Insufficient permissions' });
            //throw new Error("Access denied: Insufficient permission");
        } else {
            return res.status(200).json;
        }
    } catch (error) {
        console.error('Permission error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};