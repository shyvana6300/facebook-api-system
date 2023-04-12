const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;

/**
 * check if email from request exist in DB 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkEmailExist = async (req, res, next) => {
    try {
        console.log("===verifyRegister 0, start Verify email");
        // Check email exist
        let result = await Account.findOne({
            where: {
                email: req.body.email,
            }
        });
        console.log("===verifyRegister 1, DB account: " + JSON.stringify(result));
        if (result) {
            console.log("====verifyRegister 2, before send message error ")
            return res.status(400).send({
                message: "Email has already been used by another account!"
            })
        }
        console.log("====verifyRegister 3, before next ")
        next();
    } catch (error) {
        return res.status(500).send({
            message: "Error when checking email exist: " + error.message
        })
    }
}

module.exports = {
    checkEmailExist: checkEmailExist
}