const Joi = require('joi');
const validateRegister = (req) => {
    const schema = Joi.object({
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'vn', 'jp'] } }).required(),
        // at least 1 A, 1 a, 1 number
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
    })
    
    return schema.validate(req.body);
}

module.exports = {
    validateRegister: validateRegister
}