import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma
const prisma = new PrismaClient();

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Middleware to check if the user is authenticated
export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    console.log("Error 2");
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    console.log("Error here");
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if the user has the ADMIN role
export const authorizeAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  if (!req.user) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  next();
};