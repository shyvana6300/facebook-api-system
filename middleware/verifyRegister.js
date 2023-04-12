const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const schema = require('../validator/schema/schema');

/**
 * check if email from request exist in DB 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
checkEmailExist = async (req, res, next) => {
    try {
        // Check email exist
        let result = await Account.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (result) {
            return res.status(400).send({
                message: "Email has already been used by another account!"
            })
        } else {
            // Get schema for validating
            const schemaAccount = schema.schemaAccount;
            // Validate req body
            const result = schemaAccount.validate(req.body);
            if (result.error) {
                return res.status(400).send(result.error.details[0].message);
            }
        }
        next();
    } catch (error) {
        return res.status(500).send({
            message: "Error when checking email exist: " + error.message
        })
    }
}

module.exports = {
    checkEmailExist: checkEmailExist
}