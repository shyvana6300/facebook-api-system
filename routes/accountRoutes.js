// const express = require('express');
// const account_router = express.Router();
const accountController = require('../controller/accountController');
const verifyRegister = require('../middleware/verifyRegister');
// account_router.post('/register', [verifyRegister.checkEmailExist], accountController.register);
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/account/register",[verifyRegister.checkEmailExist], accountController.register);
};

// module.exports = account_router;