import { Request, Response, NextFunction } from 'express';
import { donatedItemStatusSchema } from '../schemas/donatedItemSchema';

export const donatedItemStatusValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = donatedItemStatusSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
