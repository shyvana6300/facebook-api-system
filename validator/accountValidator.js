const validateRegister = (req) => {
    const schema = {
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'vn', 'jp'] } }),
        // at least 1 A, 1 a, 1 number
        password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$'))
    }
    
    return Joi.validate(req.body, schema);
}

module.exports = {
    validateRegister: validateRegister
}