const express = require('express');
const account_router = express.Router();
const accountController = require('../controller/accountController');
const accountValidator = require('../middleware/accountValidator');
const authValidator = require('../middleware/authenticationValidator')
account_router.post('/register', accountValidator.validateRegister, accountController.register);

account_router.post('/login', accountController.login);

account_router.post('/testGetToken', authValidator.verifyToken, accountController.testGetToken);


module.exports = account_router;