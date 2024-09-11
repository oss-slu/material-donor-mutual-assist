import Joi from 'joi';

export const donorSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    contact: Joi.string().regex(/^[0-9]{10}$/).allow(''),  // Allows empty string or 10-digit number
    email: Joi.string().email().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().allow(''),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zipcode: Joi.string().regex(/^[0-9]{5}$/),  // 5-digit US ZIP code
    emailOptIn: Joi.boolean().required()
});
