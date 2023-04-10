const express = require('express');
const account_router = express.Router();
const accountController = require('../controller/Account');

account_router.post('/register', accountController.register);

account_router.post('/login', accountController.login)

account_router.post('/getToken', accountController.getToken)


module.exports = account_router;