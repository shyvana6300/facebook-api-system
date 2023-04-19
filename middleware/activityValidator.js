const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const schema = require('../schema/schema');
const activitiyServices = require("../services/activitiyServices");
const accountServices = require("../services/accountServices");

/**
 * Validate request body for post status
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validatePostStatus = async (req, res, next) => {
    const file = req.file;
    const content = req.body.content;
    let fileIsMissing = false;
    let contentIsMissing = false;
    if (!file) {
        console.log("===file missing");
        fileIsMissing = true;
    }
    if (!content || !content.replace(/\s/g, '').length) {
        console.log("===content missing");
        contentIsMissing = true;
    }
    // return message error if req does not contains both file and content 
    if (fileIsMissing && contentIsMissing) return res.status(404).send({ message: "Please enter content or image!" });
    next();
}

/**
 * Validate req body before adding comment
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateComment = async (req, res, next) => {
    // check account exist
    const account = await accountServices.findAccountByEmail(req.email);
    if (!account) {
        return res.status(404).send({ message: "Account not exist!" });
    // if account exist, check if status exist
    } else {
        let result = schema.schemaComment.validate(req.body);
        if (result.error) {
            return res.status(400).send(result.error.details[0].message);
        }
    }
    if (!checkStatusExist(req.body.statusId)) {
        return res.status(404).send('Cannot comment to a status that not exist!');
    }
    next();
}
const checkStatusExist = (statusId) => {
    try {
        let check = true;
        const status = await activitiyServices.getStatusById(statusId);
        if (!status) check = false;
        return check;
    } catch (error) {
        throw Error('An unexpected error occurred while checking status exist!');
    }
    
    next();
}
const tmpMiddleware = async (req, res, next) => {
    next();
}
module.exports = {
    validatePostStatus: validatePostStatus,
    validateComment: validateComment
}