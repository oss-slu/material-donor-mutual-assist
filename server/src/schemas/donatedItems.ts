import Joi from 'joi';
//DonatedItem schema
export const donatedItemSchema = Joi.object({
    itemType: Joi.string().required(),
    currentStatus: Joi.string()
        .valid('Received', 'Pending', 'Processed', 'Delivered')
        .required(),
    donorId: Joi.number().integer().required(),
    programId: Joi.number().integer().required(),
    dateDonated: Joi.date().required(), // Validates as a proper date
});

// DonatedItemStatus schema
export const donatedItemStatusSchema = Joi.object({
    statusType: Joi.string()
        .valid('Received', 'Pending', 'Processed', 'Delivered')
        .required(),
    donatedItemId: Joi.number().integer().required(), // Ensures it's a valid integer
    dateModified: Joi.date(), // Validates as a proper date
});
