const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const schema = require('../schema/schema');

/**
 * check if email from request exist in DB 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateRegister = async (req, res, next) => {
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
};

const validateLoginOTP = async (req, res, next) => {
    try {
        // get account by email from request
        let account = await Account.findOne({
            where: {
                email: req.body.email,
            },
        });
        // validate request body param { email, otp}
        if (!account) {
            return res.status(404).send({ message: "Account not found!" });
        } else if (!account.otp || account.otp !== req.body.otp) {
            return res.status(400).send({ otp: account.otp, message: "OTP not match!" });
        }
        next();
    } catch (error) {
        return res.status(500).send({
            message: "Some error occurred when login!" + error.message
        })
    }
}
module.exports = {
    validateRegister: validateRegister,
    validateLoginOTP: validateLoginOTP
}