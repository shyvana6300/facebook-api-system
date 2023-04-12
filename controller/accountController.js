const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const Op = baseModel.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const verifyRegister = require('../middleware/accountValidator');
const register = async (req, res, next) => {
    console.log("---Called /register---");
    // Save new account to DB
    try {
        const account = await Account.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            role: "user",
        })
        res.send(account);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Create new account error."
        });
    }
};

const login = async (req, res) => {
    console.log("---Called /login---");
    const account = await Account.findOne({
        where: {
            email: req.body.email,
        },
    });

    if (!account) {
        return res.status(404).send({ message: "User email not found!" });
    }

    const checkPassword = bcrypt.compareSync(
        req.body.password,
        account.password
      );


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
