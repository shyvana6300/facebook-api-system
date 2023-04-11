const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const accountValidator = require('../validator/accountValidator.js');
// const Op = baseModel.Sequelize.Op;

const register = (req, res) => {
  console.log("---Called /register---");
  // TODO: validate request
  var result = accountValidator.validateRegister(req);
  
  if (result.error) {
    res.status(400).send(result.error);
  }

  // Create new account object
  const newAccount = {
    email: req.body.email,
    password: req.body.password,
    role: "user",
  };
  // Save new account to DB
  Account.create(newAccount)
    .then((data) => {
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
