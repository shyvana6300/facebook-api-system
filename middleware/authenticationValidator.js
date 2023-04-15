const jwt = require('jsonwebtoken');
const config = require("../config/authconfig");
const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;

const verifyTokenLogin = (req, res, next) => {
    let token = req.session.tokenLogin;
    // check if token exist
    if(!token) {
        return res.status(403).send('No token provided!')
    }
    // verify token
    jwt.verify(token, config.secret_key, (error, decoded) => {
        if (error) {
            return res.status(401).send('Token Unauthorized!');
        }
        console.log('===Token verified!! Pass!!');
        req.email = decoded.email;
        next();
    })
}

module.exports = {
    verifyTokenLogin: verifyTokenLogin
}