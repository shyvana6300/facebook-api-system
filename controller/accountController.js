const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const bcrypt = require("bcryptjs");
const otpGenerator = require('../utils/otpGenerator');
const jwt = require("jsonwebtoken");
const config = require("../config/authconfig");

const register = async (req, res, next) => {
    console.log("---Called /register---");

    // Save new account to DB
    try {
        const account = await Account.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role: "user",
        });
        res.status(201).send(account);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when creating new account."
        });
    }
};

const login = async (req, res) => {
    console.log("---Called /login---");
    try {
        // check account email exists
        let account = await Account.findOne({
            where: {
                email: req.body.email,
            },
        });
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
        // Create otp to verify
        const otp = {
            value: otpGenerator.generateOTP(),
            timeCreated: new Date().getTime()
        }
        console.log(JSON.stringify(otp));
        req.session.otp = otp;
        console.log('-----OTP set to session: ' + JSON.stringify(otp));
        return res.status(200).send('Your OTP is: ' + otp.value);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when signing in."
        });
    }
};

const getTokenLogin = (req, res) => {
    console.log("---Called /getToken---");
    // Generate token - expired in 60 seconds
    const token = jwt.sign({ email: req.body.email }, config.secret_key, { expiresIn: 60 });
    // Set token to session
    req.session.tokenLogin = token;
    return res.status(200).send(token);
};

const forgotPassword = (req, res) => {
    console.log("---Called /forgotPassword---");

    console.log("---protocol: " + req.protocol); //-> http
    console.log("---host: " + req.get('host')); //-> localhost:3000    
    console.log("---originalUrl: " + req.originalUrl); //-> /account/forgotPassword
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("---fullUrl: " + fullUrl); //-> http://localhost:3000/account/forgotPassword

    // Create Token - expired in 60 seconds
    const tokenForgotPass = jwt.sign({ email: req.body.email }, config.secret_key, { expiresIn: 60 });
    // Create link with token provided
    const resetPassURL = `${req.protocol}://${req.get('host')}/account/resetPassword/${tokenForgotPass}`;
    // Return link to response
    res.status(200).send(resetPassURL);
};

const testGetToken = (req, res) => {
    console.log("---Called /TestgetToken---");
    res.send(" ---getToken ---");
};

const resetPassword = async (req, res) => {
    console.log("---Called /resetPassword---");
    // Update password for account with email send
    await Account.update({ password: bcrypt.hashSync(req.body.newPassword, 8)}, {
        where: {
            email: req.email
        }
    }).then(result => {
        if (result == 1) {
            res.status(200).send('Your password has been updated!');
        }
    }).catch(error => {
        res.status(500).send({
            message: "Error reset password for account " + req.email
        });
    });
};

const tmpFunction = (req, res) => {
    console.log("---Called /HHHHH---");
    res.send(" ---tmpFunction ---");
};

const testApi = (req, res) => {
    console.log("---Called /testApi---");
    res.status(200).send(" ---testApi Called ---");
};

module.exports = {
    register: register,
    login: login,
    testGetToken: testGetToken,
    getTokenLogin: getTokenLogin,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    tmpFunction: tmpFunction,
    testApi: testApi
};
