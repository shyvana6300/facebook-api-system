const baseModel = require("../model/baseModel");
const Account = baseModel.accountModel;
const Op = baseModel.Sequelize.Op;

const register = (req, res) => {
  console.log("---Called /register---");
  res.send(" ---Register ---");
  // TODO: validate request

  // Create new account object
  const newAccount = {
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  }

  // Save new account to DB
  Account.create(newAccount)
    .then(data => {
        // return res.send(data);
        console.log("register thanh cong");
    })
    .catch(err => {
        // return res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating the Tutorial."
        // });
        console.log("==============loiii==========");
        res.send(err);
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
