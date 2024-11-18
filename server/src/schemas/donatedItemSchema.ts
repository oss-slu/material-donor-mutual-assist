import Joi from 'joi';

//DonatedItem schema
export const donatedItemSchema = Joi.object({
    itemType: Joi.string().required(),
    currentStatus: Joi.string()
        .valid('Received', 'Pending', 'Processed', 'Delivered')
        .required(),
    donorId: Joi.alternatives(Joi.number(), Joi.string().pattern(/^\d+$/))
        .required()
        .messages({
            'string.pattern.base':
                'donorId must be either a number or a numeric string',
        }),
    programId: Joi.alternatives(Joi.number(), Joi.string().pattern(/^\d+$/))
        .allow(null)
        .allow('')
        .messages({
            'string.pattern.base':
                'programId must be either a number or a numeric string',
        }),
    dateDonated: Joi.date().required(), // Validates as a proper date
});

// DonatedItemStatus schema
export const donatedItemStatusSchema = Joi.object({
    statusType: Joi.string()
        .valid('Received', 'Donated', 'In storage facility', 'Refurbished', 'Item sold')
        .required(),
    donatedItemId: Joi.number().integer().required(), // Ensures it's a valid integer
    dateModified: Joi.date(), // Validates as a proper date
});
