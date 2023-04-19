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
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'vn', 'jp'] } })
        .required(),
})

const schemaLoginToken = Joi.object({
    email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
    otp: Joi.string()
        .required(),
})

const schemaNewPassword = Joi.object({
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
    passwordConfirm: Joi.string().required(),
})

const schemaComment = Joi.object({
    content: Joi.string().required(),
    idCommentator: Joi.number().required(),
    idStatus: Joi.number().required(),
})
module.exports = {
    schemaAccount: schemaAccount,
    schemaEmailForgot: schemaEmailForgot,
    schemaNewPassword: schemaNewPassword,
    schemaLoginToken: schemaLoginToken,
    schemaComment: schemaComment
};