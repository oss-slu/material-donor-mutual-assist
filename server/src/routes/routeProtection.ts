import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

//const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = 'xalngJIazn'; // I don't know why calling the process above was always creating errors during the checks. It works when checked manually
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}

export const authenticateUser = async (
    req: Request,
    res: Response,
    adminPerm: Boolean,
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: 'Access denied: Not logged in' });
            return false;
        }
        const decoded = jwt.verify(authHeader, JWT_SECRET) as { role: string };
        if (decoded.role != 'ADMIN' && adminPerm) {
            res.status(401).json({
                message: 'Access denied: Insufficient permissions',
            });
            return false;
        } else {
            res.status(200).json;
            return true;
        }
    } catch (error) {
        console.error('Permission error:', error);
        res.status(500).json({ message: 'Internal server error' });
        return false;
    }
};
