const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
const schema = require('../schema/schema');
const activityServices = require("../services/activityServices");
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
    if (fileIsMissing && contentIsMissing) return res.status(400).send({ message: "Please enter content or image!" });
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
    let result = await schema.schemaComment.validate(req.body);
    if (result.error) {
        /* #swagger.responses[400] = { description: 'Invalid comment input' } */   
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}

/**
 * Validate reaction request 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const validateReaction = async (req, res, next) => {
    console.log('===begin validate reaction');
    console.log(JSON.stringify(req.body));

    let result = await schema.schemaReaction.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}
const tmpMiddleware = async (req, res, next) => {
    next();
}
module.exports = {
    validatePostStatus: validatePostStatus,
    validateComment: validateComment,
    validateReaction: validateReaction
}