const express = require('express');
const account_router = express.Router();
const accountController = require('../controller/accountController');
const accountValidator = require('../middleware/accountValidator');
const authValidator = require('../middleware/authenticationValidator')
account_router.post('/register', [accountValidator.validateAccount ,accountValidator.validateRegister], accountController.register);

account_router.post('/login', [accountValidator.validateAccount, accountValidator.validateLogin], accountController.login);

account_router.get('/testGetToken', authValidator.verifyTokenLogin, accountController.testGetToken);

account_router.post('/getTokenLogin', accountValidator.validateGetTokenLogin, accountController.getTokenLogin);
account_router.post('/forgotPassword', accountValidator.validateForgotPassword, accountController.forgotPassword);
account_router.post('/resetPassword/:token', [authValidator.verifyTokenResetPwd ,accountValidator.validateResetPassword], accountController.resetPassword);

account_router.get('/testApi', accountController.testApi);

module.exports = account_router;