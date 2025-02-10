import Joi from 'joi';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/;

export const donorSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    contact: Joi.string()
        .regex(/^[0-9]{10}$/)
        .allow(''),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(12)
        .pattern(passwordPattern)
        .custom((value, helpers) => {
            const { firstName, lastName, email } = helpers.state.ancestors[0];

            if (firstName && value.toLowerCase().includes(firstName.toLowerCase())) {
                return helpers.message('Password must not contain your first name.');
            }
            if (lastName && value.toLowerCase().includes(lastName.toLowerCase())) {
                return helpers.message('Password must not contain your last name.');
            }
            if (email && value.toLowerCase().includes(email.toLowerCase())) {
                return helpers.message('Password must not contain your email address.');
            }
            return value;
        })
        .messages({
            'string.min': 'Password must be at least 12 characters long.',
            'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        })
        .required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().allow(''),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zipcode: Joi.string()
        .regex(/^[0-9]{5}$/)
        .messages({
            'string.pattern.base': 'ZIP Code must be a 5-digit number.',
        }),
    emailOptIn: Joi.boolean().required(),
});
