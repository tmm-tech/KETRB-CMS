const Joi = require('joi');

const customerSchema = Joi.object({
    fullname: Joi.string()
        .required()
        .min(5),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'go.ke'] } }),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=. *[a-zA-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'))
        .required(),
    gender: Joi.string().required(),
    profile: Joi.string().uri(),
}).xor("email");

const validateCustomerSchema = (payload) => {
    return customerSchema.validateAsync(payload, { abortEarly: false })
}
module.exports = validateCustomerSchema