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
    console.log('===begin validate comment');
    console.log(JSON.stringify(req.body));

    let result = await schema.schemaComment.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    const checkStatus = await checkStatusExist(req.body.idStatus);
    if (!checkStatus) {
        console.log('return status not exist message');
        return res.status(404).send('Status is no longer exist!');
    }
    // TODO: confirm xem có cần check account sở hữu status có còn tồn tại ko? 
    //=> test thử khi xóa account thì có xóa các bài viết của account đó không
    next();
}

/**
 * Check if status with given id exist
 * @param {*} statusId 
 * @returns check: true if status exist | false if status not exist
 */
const checkStatusExist = async (statusId) => {
    try {
        console.log('===begin check status exist');
        let check = true;
        const status = await activitiyServices.getStatusById(statusId);
        if (!status) check = false;
        console.log('===end check status. KQ: ' + check);
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