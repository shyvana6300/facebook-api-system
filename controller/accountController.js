const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const accountValidator = require('../validator/accountValidator.js');
const Op = baseModel.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyRegister = require('../middleware/verifyRegister');
const register = async (req, res, next) => {
    console.log("---Called /register---");
    verifyRegister.checkEmailExist(req, res, next);
    console.log("---1, after check email---");
    const result = await accountValidator.validateRegister(req);
    console.log("---2, after validate req---");
    // send message to response if error
    if (await result.error) {
        console.log("---3, bbefore send validate message ---");
        return res.status(400).send(resultValidate.error.details[0].message);
    }
    console.log("---4, bbefore create account ---");
    // Save new account to DB
    await Account.create({
        email: req.body.email,
        password: req.body.password,
        role: "user",
    }).then((data) => {
            return res.send(data);
        })
        .catch((err) => {
            return res.status(500).send({
                message:
                    err.message || "Create new account error."
            });
        });
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
