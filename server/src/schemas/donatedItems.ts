import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const donatedItemSchema = Joi.object({
    itemType: Joi.string().max(50).required(), // itemType should be a string with a max length of 50
    currentStatus: Joi.string().max(20).required(), // currentStatus should be a string with a max length of 20
    dateDonated: Joi.date().required(), // dateDonated should be a valid date
    donorId: Joi.number().integer().required(), // donorId should be a required integer
    programId: Joi.number().integer().required(), // programId should be a required integer
    imageUrls: Joi.array().items(Joi.string()).max(5), // imageUrls should be an array of strings, max 5 images
});

// Validator middleware
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
