import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';  // Import Prisma client

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const newAdmin = await prisma.admin.create({
      data: req.body
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating admin' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

export default router;
