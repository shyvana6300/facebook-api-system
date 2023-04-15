const express = require('express');
const account_router = express.Router();
const accountController = require('../controller/accountController');
const accountValidator = require('../middleware/accountValidator');
const authValidator = require('../middleware/authenticationValidator')
account_router.post('/register', accountValidator.validateRegister, accountController.register);

account_router.post('/login', accountController.login);

account_router.get('/testGetToken', authValidator.verifyToken, accountController.testGetToken);

account_router.post('/getTokenLogin', accountValidator.validateGetTokenLogin, accountController.getTokenLogin);
account_router.post('/forgotPassword', accountValidator.validateForgotPassword, accountController.forgotPassword);

account_router.get('/testApi', accountController.testApi);

module.exports = account_router;