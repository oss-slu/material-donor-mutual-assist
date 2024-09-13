import { Router, Request, Response } from 'express';
import prisma from '../prismaClient';  // Import Prisma client
import { donorValidator } from '../validators/donorValidator'

const router = Router();

router.post('/', donorValidator, async (req: Request, res: Response) => {
  try {
    const newDonor = await prisma.donor.create({
      data: req.body
    });
    console.log('New donor created:', newDonor);
    res.status(201).json(newDonor);
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({ message: 'Error creating donor' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const donors = await prisma.donor.findMany();
    res.json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

export default router;
