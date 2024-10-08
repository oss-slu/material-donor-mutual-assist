import { Request, Response, NextFunction } from 'express';
import { donatedItemSchema } from '../schemas/donatedItems';

export const donatedItemValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = donatedItemSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
