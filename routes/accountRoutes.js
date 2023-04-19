const express = require('express');
const multer  = require('multer');
const upload = require('../middleware/uploadAvatar');
const account_router = express.Router();
const accountController = require('../controller/accountController');
const accountValidator = require('../middleware/accountValidator');
const authValidator = require('../middleware/authenticationValidator')
account_router.post('/register', [accountValidator.validateAccount ,accountValidator.validateRegister], accountController.register);

account_router.post('/login', [accountValidator.validateAccount, accountValidator.validateLogin], accountController.loginOTP);
// route: get token login with email and top given
account_router.post('/getTokenLogin', [accountValidator.validateLoginTokenSchema, accountValidator.validateLoginToken], accountController.getTokenLogin);
// test route for api who need login 
account_router.get('/testGetToken', authValidator.verifyTokenLogin, accountController.testGetToken);
account_router.post('/forgotPassword', accountValidator.validateEmailForgot, accountController.forgotPassword);
account_router.post('/resetPassword/:token', [authValidator.verifyTokenResetPwd ,accountValidator.validateNewPassword], accountController.resetPassword);
account_router.put('/updateProfile', [authValidator.verifyTokenLogin, upload.single('avatar')], accountController.updateProfile);
account_router.put('/postStatus', [authValidator.verifyTokenLogin, upload.single('statusImage')], accountController.postStatus);
account_router.get('/testApi', accountController.testApi);


module.exports = account_router;