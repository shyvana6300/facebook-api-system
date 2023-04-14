const Joi = require('joi');

const schemaAccount = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'vn', 'jp'] } })
        .required(),
    // at least 1 A, 1 a, 1 number
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
})

const schemaEmailForgot = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
})
module.exports = {
    schemaAccount: schemaAccount,
    schemaEmailForgot: schemaEmailForgot
};