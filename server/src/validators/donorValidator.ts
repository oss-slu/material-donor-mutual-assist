import { Request, Response, NextFunction } from 'express';
import { donorSchema } from '../schemas/donorSchema';

export const donorValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = donorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};
