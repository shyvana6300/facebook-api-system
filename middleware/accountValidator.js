const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const schema = require('../schema/schema');
const bcrypt = require("bcryptjs");
const accountServices = require("../services/accountServices");

/**
 * check if email from request exist in DB 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateRegister = async (req, res, next) => {
    try {
        // Check email exist
        const result = await accountServices.findAccountByEmail(req.body.email);
        if (result) {
            return res.status(400).send({
                message: "Email has already been used by another account!"
            })
        }
        next();
    } catch (error) {
        return res.status(500).send({
            message: "Error when checking email exist: " + error.message
        })
    }
};

/**
 * Validate account exist with given email
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateLogin = async (req, res, next) => {
    // check account email exists
    let account = await accountServices.findAccountByEmail(req.body.email);
    if (!account) {
        return res.status(404).send({ message: "Account not found!" });
    }
    // check password valid
    const checkPassword = bcrypt.compareSync(
        req.body.password,
        account.password
    );
    if (!checkPassword) {
        return res.status(401).send('Invalid password!');
    }
    next();
}

/**
 * Validate account email + password by schema
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateAccount = (req, res, next) => {
    // Get schema for validating
    const schemaAccount = schema.schemaAccount;
    // Validate req body
    let result = schemaAccount.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}

/**
 * Validate account exist + otp valid
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateLoginToken = async (req, res, next) => {
    try {
        // TODO: tach logic sang service + tao validate param cho OTP
        console.log('====validate getToken = ');
        const otp = req.session.otp;
        const email = req.session.email;
        console.log('-----OTP get from session: ' + JSON.stringify(otp));
        console.log('-----OTP get from request: ' + req.body.otp);
        console.log('-----email get from session: ' + email);
        console.log('-----email get from request: ' + req.body.email);
        const isExpired = checkExpiredOTP(otp);
        console.log('====checkExpiredOTP = ' + isExpired);
        // get account by email from request
        let account = await accountServices.findAccountByEmail(req.body.email);
        // validate request body param { email, otp}
        if (!account) {
            return res.status(404).send({ message: "Account not exist!" });
        } else if (!req.session.otp) {
            return res.status(400).send({ message: "OTP not exist!" });
        } else if (req.session.otp.value !== req.body.otp || req.session.email !== req.body.email) {
            return res.status(400).send({ message: "OTP or email not match!" });
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

/**
 * Validate email by schema
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateEmailForgot = async (req, res, next) => {
    const schemaEmailForgot = schema.schemaEmailForgot;
    const result = schemaEmailForgot.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}

/**
 * Validate new password by schema
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateNewPassword = async (req, res, next) => {
    const schemaNewPassword = schema.schemaNewPassword;
    const result = schemaNewPassword.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    } else if (req.body.passwordConfirm !== req.body.newPassword) {
        return res.status(400).send('Password confirm not match!');
    }
    next();
}

/**
 * Validate email + otp Login by schema
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateLoginTokenSchema = async (req, res, next) => {
    const schemaLoginToken = schema.schemaLoginToken;
    const result = schemaLoginToken.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}

/**
 * Check if otp valid
 * @param {*} otp 
 * @returns 
 */
function checkExpiredOTP(otp) {
    console.log('===checkexpired OTP: '+otp);
    if (!otp) return false
    const currentTime = new Date().getTime();
    const differentMinutes = (currentTime - otp.timeCreated) / 1000 / 60;
    console.log("---khoang cach phut  = " + differentMinutes);
    return differentMinutes > 1 ? false : true;
}


module.exports = {
    validateRegister: validateRegister,
    validateLoginToken: validateLoginToken,
    validateEmailForgot: validateEmailForgot,
    validateNewPassword: validateNewPassword,
    validateLogin: validateLogin,
    validateAccount: validateAccount,
    validateLoginTokenSchema: validateLoginTokenSchema
}