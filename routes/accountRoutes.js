const express = require('express');
const account_router = express.Router();
const accountController = require('../controller/accountController');
const accountValidator = require('../middleware/accountValidator');
account_router.post('/register', accountValidator.validateRegister, accountController.register);

account_router.post('/login', accountController.login)

account_router.post('/getToken', accountController.getToken)


module.exports = account_router;