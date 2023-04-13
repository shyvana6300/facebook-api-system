const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const Op = baseModel.Sequelize.Op;
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
            otp: ''
        })
        res.send('You has been sign up!');
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
        // Create otp and update it to current Account
        account = await Account.update({
            otp: otpGenerator.generateOTP(),
        },
        {
            where: { email: req.body.email },
        });
        account = await Account.findOne({
            where: {
                email: req.body.email,
            },
        });
        return res.status(200).send('Your OTP is: ' + account.otp);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when signing in."
        });
    }
};

const testGetToken = (req, res) => {
    console.log("---Called /TestgetToken---");
    res.send(" ---getToken ---");
};
const getToken = (req, res) => {
    console.log("---Called /getToken---");
    // Generate token
    const token = jwt.sign({ email: req.body.email }, config.secret_key, { expiresIn: 3600 });
    // Set token to session
    req.session.token = token;
    return res.status(200).send(token);
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
    getToken: getToken,
    tmpFunction: tmpFunction,
    testApi: testApi
};
