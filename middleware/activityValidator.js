const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const schema = require('../schema/schema');
const bcrypt = require("bcryptjs");
const activitiyServices = require("../services/accountServices");

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

const tmpMiddleware = async (req, res, next) => {
    next();
}
module.exports = {
    validatePostStatus: validatePostStatus,
}