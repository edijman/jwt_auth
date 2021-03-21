const Joi = require('@hapi/joi')

// Registration Validation
const registrationvalidation = (data) => {
    const schema =  Joi.object({
        firstName: Joi.string()
            .min(2)
            .required(),
        lastName: Joi.string()
            .min(2)
            .required(),
        email: Joi.string()
            .min(6)
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    })

    return schema.validate(data)
}

// Login Validation
const loginValidation = (data) => {
    const schema =  Joi.object({
        email: Joi.string()
            .min(6)
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });

    return schema.validate(data)
}
module.exports = {
    registrationvalidation,
    loginValidation
}