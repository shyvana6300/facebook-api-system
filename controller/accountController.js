const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const config = require("../config/authconfig");
const Op = baseModel.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
            message: error.message || "Unexpected error occurred when creating new account."
        });
    }
};

const login = async (req, res) => {
    console.log("---Called /login---");
    try {
        // check account email exists
        const account = await Account.findOne({
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
        // Generate token
        const token = jwt.sign({email: account.email}, config.secret_key, {expiresIn: 3600});
        // Set token to session
        req.session.token = token;
        return res.status(200).send(token);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when signing in."
        });
    }




};

const testGetToken = (req, res) => {
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
    testGetToken: testGetToken,
    tmpFunction: tmpFunction,
};
