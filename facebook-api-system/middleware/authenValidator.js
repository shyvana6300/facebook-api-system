const jwt = require('jsonwebtoken');
const config = require("../config/authconfig");

const verifyTokenLogin = (req, res, next) => {
    let token = req.session.tokenLogin;
    // check if token exist
    /* #swagger.responses[401] = { description: 'Unauthorized or expired token' } */
    if(!token) {
        return res.status(401).send('No token provided! Please login again.')
    }
    // verify token
    jwt.verify(token, config.secret_key, (error, decoded) => {
        if (error) {
            return res.status(401).send('Token Unauthorized or Expired! Please login again.');
        }
        req.email = decoded.email;
        next();
    })
}

const verifyTokenResetPwd = (req, res, next) => {
    let token = req.params.token;
    // verify token
    jwt.verify(token, config.secret_key, (error, decoded) => {
        if (error) {
            /* #swagger.responses[401] = { description: 'Token Unauthorize or Expired' } */
            return res.status(401).send('Token Reset Unauthorized or Expired!');
        }
        req.email = decoded.email;
        next();
    })
}

module.exports = {
    verifyTokenLogin: verifyTokenLogin,
    verifyTokenResetPwd: verifyTokenResetPwd
}