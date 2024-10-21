import { Request, Response, NextFunction } from 'express';
import { donatedItemSchema } from '../schemas/donatedItems';

export const donatedItemValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { error } = donatedItemSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        return res.status(400).json({
            message: error.details.map(detail => detail.message).join(', '), // Return all error messages
        });
    }
    // Ensure that images were uploaded if expected
    if (!req.files || req.files.length === 0) {
        return res
            .status(400)
            .json({ message: 'At least one image must be uploaded.' });
    }
    next();
};
