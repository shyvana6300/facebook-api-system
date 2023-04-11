function authenticate(res, req, next) {
    console.log('-----Authenticating-----');
    next();
}

module.exports = authenticate;