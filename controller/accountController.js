const accountServices = require("../services/accountServices");

const register = async (req, res, next) => {
    console.log("---Called /register---");
    // Save new account to DB
    try {
        const newAccount = await accountServices.register(
            req.body.email,
            req.body.password
        )
        res.status(201).send(newAccount);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when creating new account."
        });
    }
};

const loginOTP = async (req, res) => {
    console.log("---Called /login---");
    const otp = await accountServices.generateOTP();
    req.session.otp = otp;
    console.log('-----OTP set to session: ' + JSON.stringify(otp.value));
    return res.status(200).send('Your OTP is: ' + otp.value);
};

const getTokenLogin = (req, res) => {
    console.log("---Called /loginToken---");
    // Generate token - expired in 60 seconds
    const token = accountServices.generateToken(req.body.email);
    // Set token to session
    req.session.tokenLogin = token;
    return res.status(200).send(token);
};

const forgotPassword = async (req, res) => {
    // Create link with token provided
    const resetPassURL = await accountServices.generateURLForgetPassword(req.body.email, req.protocol, req.get('host'));
    // Return link to response
    res.status(200).send(resetPassURL);
};

const resetPassword = async (req, res) => {
    console.log("---Called /resetPassword---");
    try {
        // Update password for account with email send
        const result = await accountServices.resetPassword(
            req.email,
            req.body.newPassword
        )
        if (result == 1) {
            res.status(200).send('Your password has been updated!');
        }
    } catch(error) {
        res.status(500).send({
            message: "Error reset password for account " + req.email
        });
    };
};

const testGetToken = (req, res) => {
    console.log("---Called /TestgetToken---");
    res.send(" ---getToken ---");
};

const updateProfile = (req, res) => {
    console.log("---Called /updateProfile---");
    res.send(" ---updateProfile ---");
};
const tmpFunction = (req, res) => {
    console.log("---Called /HHHHH---");
    res.send(" ---tmpFunction ---");
};

const testApi = (req, res) => {
    console.log("---Called /testApi---");
    res.status(200).send(" ---testApi Called ---");
};

module.exports = {
    register: register,
    loginOTP: loginOTP,
    testGetToken: testGetToken,
    getTokenLogin: getTokenLogin,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    updateProfile: updateProfile,
    tmpFunction: tmpFunction,
    testApi: testApi
};
