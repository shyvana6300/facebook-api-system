const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const otpGenerator = require('../utils/otpGenerator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/authconfig");

/**
 * Create a new account
 * @param {*} email 
 * @param {*} password 
 * @returns newAccount: new account have just created
 */
const register = async (email, password) => {
    try {
        const newAccount = await Account.create({
            email: email,
            password: bcrypt.hashSync(password, 8),
            role: "user",
        });
        return newAccount;
    } catch (error) {
        throw Error(error.message);
    }
};

/**
 * Generate OTP for login
 * @returns OTP
 */
const generateOTP = () => {
    console.log("---Called Service /loginOTP---");
    // Create otp to verify
    const otp = {
        value: otpGenerator.generateOTP(),
        timeCreated: new Date().getTime()
    }
    console.log(JSON.stringify(otp));
    return otp;
};

/**
 * Update new password for given email
 * @param {*} email 
 * @param {*} newPassword 
 * @returns result: update result
 */
const resetPassword = async (email, newPassword) => {
    try {
        const result = await Account.update({ password: bcrypt.hashSync(newPassword, 8) }, {
            where: {
                email: email
            }
        })
        return result;
    } catch (error) {
        throw Error(error.message);
    }
};

/**
 * Generate a token with given email
 * @param {*} email 
 * @returns token
 */
const generateToken = (email) => {
    console.log("---Called /generateTOken---");
    return jwt.sign({ email: email }, config.secret_key, { expiresIn: 60 })
};

/**
 * Generate URL for resetting password
 * @param {*} email 
 * @returns URL
 */
const generateURLForgetPassword = (email) => {
    // Create Token - expired in 60 seconds
    const tokenForgotPass = generateToken(email);
    // Create URL forget password
    const resetPassURL = `${req.protocol}://${req.get('host')}/account/resetPassword/${tokenForgotPass}`;
    return resetPassURL;
}

const tmpServiceFunction = (var1, var2) => {
    console.log("---Called /HHHHH---");
    return " ---tmpServiceFunction ---";
};
module.exports = {
    register: register,
    generateOTP: generateOTP,
    resetPassword: resetPassword,
    generateToken: generateToken,
    generateURLForgetPassword: generateURLForgetPassword
}