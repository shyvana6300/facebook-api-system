const accountServices = require("../services/accountServices");

const register = async (req, res, next) => {
    /* 	#swagger.tags = ['Account']
        #swagger.description = 'Sign up a specific account' */

    console.log("---Called /register---");
    // Save new account to DB
    try {
        const newAccount = await accountServices.register(
            req.body.email,
            req.body.password
        )
        /* #swagger.responses[201] = {
            description: 'Account created.',
            schema: { $ref: '#/definitions/NewAccount' }
        } */
        res.status(201).send(newAccount);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when creating new account."
        });
    }
};

const loginOTP = async (req, res) => {
    /* 	#swagger.tags = ['Account']
        #swagger.description = 'Sign in a specific user to get OTP login' */

    /*	#swagger.parameters['obj'] = {
        in: 'body',
        description: 'Account infor.',
        required: true,
        schema: { $ref: "#/definitions/Account" }
    } */
    console.log("---Called /login---");
    const otp = await accountServices.generateOTP();
    req.session.otp = otp;
    req.session.email = req.body.email;
    console.log('-----OTP set to session: ' + JSON.stringify(otp.value));
    console.log('-----Email set to session: ' + JSON.stringify(req.session.email));
    /* #swagger.responses[200] = { description: 'Email and password is valid - Return OTP' } */
    return res.status(200).send('Your OTP is: ' + otp.value);
};

/**
 * Login to system
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getTokenLogin = (req, res) => {
    /* 	#swagger.tags = ['Account']
        #swagger.description = 'Get login Token for email signed in and OTP provided' */

    /*	#swagger.parameters['obj'] = {
        in: 'body',
        description: 'Account infor.',
        required: true,
        schema: { $ref: "#/definitions/getTokenLogin" }
    } */

    console.log("---Called /loginToken---");
    // Generate token - expired in 60 seconds
    const token = accountServices.generateToken(req.body.email);
    // Set token to session
    req.session.tokenLogin = token;
    /* #swagger.responses[200] = { description: 'Login successful' } */
    return res.status(200).send('You has been logged in!');
};

/**
 * Generate link to reset password
 * @param {*} req 
 * @param {*} res 
 */
const forgotPassword = async (req, res) => {
    /* 	#swagger.tags = ['Account']
        #swagger.description = 'Enter email for resetting password' */
    // Create link with token provided
    const resetPassURL = await accountServices.generateURLForgetPassword(req.body.email, req.protocol, req.get('host'));
    /* #swagger.responses[200] = { description: 'Return reset password URL with token' } */
    res.status(200).send(resetPassURL);
};

/**
 * Create new password
 * @param {*} req 
 * @param {*} res 
 */
const resetPassword = async (req, res) => {
    /* 	#swagger.tags = ['Account']
        #swagger.description = 'Create new password' */
    try {
        // Update password for account with email send
        const result = await accountServices.resetPassword(
            req.email,
            req.body.newPassword
        )
        if (result == 1) {
            /* #swagger.responses[200] = { description: 'Create new password successful' } */
            res.status(200).send('Your password has been updated!');
        }
    } catch (error) {
        res.status(500).send({
            message: "Error reset password for account " + req.email
        });
    };
};

const testGetToken = (req, res) => {
    /* 	#swagger.tags = ['Testing']
        #swagger.description = 'Test API with login required' */
    console.log("---Called /TestgetToken---");
    res.send(" ---getToken ---");
};

/**
 * Update account profile
 * @param {*} req 
 * @param {*} res 
 */
const updateProfile = async (req, res) => {
    /* 	#swagger.tags = ['Account']
        #swagger.description = 'Update account profile' */

    /*	#swagger.parameters['Avatar Image'] = {
            in: 'formData',
            type: 'file',
            description: 'Select avatar image',
        }

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Profile information.',
            schema: { $ref: "#/definitions/updateProfile" }
        } */
    console.log("---Called /updateProfile---");
    try {
        const result = await accountServices.updateProfile(req);

        // if (result == 1) {
            
        // }
        /* #swagger.responses[200] = { description: 'Update profile successful' } */
        res.status(200).send('Your profile has been updated!');
    } catch (error) {
        /* #swagger.responses[500] = { description: '' } */
        res.status(500).send({
            message: "Error when update profile for account " + req.email,
            error: error
        });
    };
};

const tmpFunction = (req, res) => {
    console.log("---Called /HHHHH---");
    res.send(" ---tmpFunction ---");
};

const testApi = (req, res) => {
    /* 	#swagger.tags = ['Testing']
        #swagger.description = 'Test API' */
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
