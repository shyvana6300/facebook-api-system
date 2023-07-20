const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const otpGenerator = require('../utils/otpGenerator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/authconfig");

/**
 * Create a new account
 * @param {*} email 
 * @param {*} password 
 * @returns newAccount: new account have just created
 */
const register = async (email, password) => {
    const transaction = await baseModel.sequelize.transaction();
    try {
        const newAccount = await Account.create({
            email: email,
            password: bcrypt.hashSync(password, 8),
            role: "user",
        }, { trasaction: transaction });
        await transaction.commit();
        return newAccount;
    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
};

/**
 * Generate OTP for login
 * @returns OTP
 */
const generateOTP = async () => {
    console.log("---Called Service /loginOTP---");
    // Create otp to verify
    const otp = await {
        value: otpGenerator.generateOTP(),
        timeCreated: new Date().getTime()
    }
    return otp;
};

/**
 * Update new password for given email
 * @param {*} email 
 * @param {*} newPassword 
 * @returns result: update result
 */
const resetPassword = async (email, newPassword) => {
    const transaction = await baseModel.sequelize.transaction();
    try {
        const result = await Account.update({ password: bcrypt.hashSync(newPassword, 8) }, {
            where: {
                email: email
            },
            trasaction: transaction
        });
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
};

/**
 * Generate a token with given email
 * @param {*} email 
 * @returns token
 */
const generateToken = (email, expiredIn) => {
    console.log("---Called /generateTOken---");
    return jwt.sign({ email: email }, config.secret_key, { expiresIn: expiredIn })
};

/**
 * Generate URL for resetting password
 * @param {*} email 
 * @returns URL
 */
const generateURLForgetPassword = async (email, protocol, host,) => {
    // Create Token - expired in 90 seconds
    const tokenForgotPass = await generateToken(email, 90);
    // Create URL forget password
    const resetPassURL = `${protocol}://${host}/account/resetPassword/${tokenForgotPass}`;
    return resetPassURL;
}

/**
 * Service for update account profile
 * @param {*} req 
 * @returns 
 */
const updateProfile = async (req) => {
    console.log("---Called /service update Profile---");
    const email = req.email;
    const transaction = await baseModel.sequelize.transaction();
    try {
        console.log("---begin update Profile---");
        // Create onject data for updating
        const profileObject = await createProfileObject(
            req.file,
            req.body.fullName,
            req.body.birthday,
            req.body.job,
            req.body.address,
            req.body.gender,
            req.protocol,
            req.get('host')
        );
        // Update account profile
        const result = await Account.update({
            avatarUrl: profileObject.avatarUrl,
            fullName: profileObject.fullName,
            birthday: profileObject.birthday,
            job: profileObject.job,
            address: profileObject.address,
            gender: profileObject.gender
        }, {
            where: { 
                email: email 
            },
            trasaction: transaction
         });
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
};

/**
 * Set profile data
 * @param {*} file 
 * @param {*} fullName 
 * @param {*} birthday 
 * @param {*} job 
 * @param {*} address 
 * @param {*} gender 
 * @param {*} protocol 
 * @param {*} host 
 * @returns 
 */
const createProfileObject = (file, fullName, birthday, job, address, gender, protocol, host) => {
    const profile = {}
    //Generate and set avatar url if user send a image avatar
    file && (profile.avatarUrl = `${protocol}://${host}/avatar/${file.originalname}`);
    fullName && (profile.fullName = fullName);
    birthday && (profile.birthday = new Date(birthday));
    job && (profile.job = job);
    address && (profile.address = address);
    gender && (profile.gender = gender);
    return profile;
}
/**
 * Get Account with email given
 * @param {} email 
 * @returns account
 */
const findAccountByEmail = async (email) => {
    try{
        const account = await Account.findOne({
            where: {
                email: email,
            }
        });
        return account;
    } catch (error) {
        throw Error(error.message);
    }
};

/**
 * Find account by id
 * @param {*} accountId 
 * @returns account: an account with given id
 */
const getAccountById = async (accountId) => {
    try {
        const account = await Account.findOne({
            where: {
                id: accountId,
            }
        });
        return account;
    } catch (error) {
        throw Error(error.message);
    }
}


/**
 * Check if otp valid
 * @param {*} otp 
 * @returns 
 */
function checkExpiredOTP(otp) {
    // Check if otp not exist
    if (!otp) return false;
    // Get current time
    const currentTime = new Date().getTime();
    // Calculate time between current time and otp's time created
    const differentMinutes = (currentTime - otp.timeCreated) / 1000 / 60;
    // Return result
    return differentMinutes > 1 ? false : true;
}

/**
 * check permission of current account
 * @param {*} email 
 */
const checkAuthorizeAdmin = async (email) => {
    try {
        // Get current account by email
        const account = await Account.findOne({
            where: {
                email: email,
            }
        });
        // Check account role
        if(account.role !== 'admin') return false;
        return true;
    } catch (error) {
        throw Error(error.message);
    }
}


module.exports = {
    register: register,
    generateOTP: generateOTP,
    resetPassword: resetPassword,
    generateToken: generateToken,
    generateURLForgetPassword: generateURLForgetPassword,
    updateProfile: updateProfile,
    findAccountByEmail: findAccountByEmail,
    getAccountById: getAccountById,
    checkExpiredOTP: checkExpiredOTP,
    createProfileObject: createProfileObject,
    checkAuthorizeAdmin: checkAuthorizeAdmin
}