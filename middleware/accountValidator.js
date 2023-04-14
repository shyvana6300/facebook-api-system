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

//TODO: validate login params. Xem xet tach doan schema ra ham rieng roi goi vao tu register va login.
const validateLogin = async (req, res, next) => {

}

const validateGetToken = async (req, res, next) => {
    try {
        console.log('====validate getToken = ');
        const otp = req.session.otp;
        console.log('-----OTP get from session: ' + JSON.stringify(otp));
        console.log('-----OTP get from request: ' + req.body.otp);
        const isExpired = checkExpiredOTP(otp);
        console.log('====checkExpiredOTP = '+isExpired);
        // get account by email from request
        let account = await Account.findOne({
            where: {
                email: req.body.email,
            },
        });
        // validate request body param { email, otp}
        if (!account) {
            return res.status(404).send({ message: "Account not exist!" });
        } else if (!req.session.otp) {
            return res.status(400).send({ message: "OTP not exist!" });
        } else if (req.session.otp.value !== req.body.otp) {
            return res.status(400).send({ message: "OTP not match!" });
        } else if (!isExpired) {
            return res.status(400).send({ message: "OTP expired! Please login again!" });
        }
        next();
    } catch (error) {
        return res.status(500).send({
            message: "Some error occurred when login: " + error.message
        })
    }
}

const validateForgotPassword = async (req, res, next) => {
    const schemaEmailForgot = schema.schemaEmailForgot;
    const result = schemaEmailForgot.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}
function checkExpiredOTP (otp) {
    if(!otp) return false
    const currentTime = new Date().getTime();
    const differentMinutes = (currentTime - otp.timeCreated) / 1000 /60;
    console.log("---khoang cach phut  = " + differentMinutes);
    return differentMinutes > 5 ? false : true;
}
module.exports = {
    validateRegister: validateRegister,
    validateGetToken: validateGetToken,
    validateForgotPassword: validateForgotPassword
}