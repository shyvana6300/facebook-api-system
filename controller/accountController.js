const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const accountValidator = require('../validator/accountValidator.js');
const Op = baseModel.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyRegister = require('../middleware/verifyRegister');
const register = async (req, res, next) => {
    console.log("---Called /register---");
    // const result = await accountValidator.validateRegister(req);
    // send message to response if error
    // if (result.error) {
    //     return res.status(400).send(resultValidate.error.details[0].message);
    // }
    // Save new account to DB
    try {
        const account = await Account.create({
            email: req.body.email,
            password: req.body.password,
            role: "user",
        })
        res.send(account);
    } catch(error) {
        res.status(500).send({
            message: err.message || "Create new account error."
        });
    }
};

const login = (req, res) => {
    console.log("---Called /login---");
    res.send(" ---Login ---");
};

const getToken = (req, res) => {
    console.log("---Called /getToken---");
    res.send(" ---getToken ---");
};

const tmpFunction = (req, res) => {
    console.log("---Called /HHHHH---");
    res.send(" ---tmpFunction ---");
};

module.exports = {
    register: register,
    login: login,
    getToken: getToken,
    tmpFunction: tmpFunction,
};
