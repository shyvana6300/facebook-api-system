const schema = require('../schema/schema');

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
    if (!file) fileIsMissing = true;
    if (!content || !content.replace(/\s/g, '').length) contentIsMissing = true;
    // return message error if req does not contains both file and content 
    if (fileIsMissing && contentIsMissing) return res.status(400).send({
         message: "Please enter content or image!" 
        });
    next();
}

/**
 * Validate req body before adding comment
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const validateComment = (req, res, next) => {
    let result = schema.schemaComment.validate(req.body);
    console.log('#####');
    console.log(result);
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
const validateReaction = (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let result = schema.schemaReaction.validate(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    next();
}

module.exports = {
    validatePostStatus: validatePostStatus,
    validateComment: validateComment,
    validateReaction: validateReaction
}