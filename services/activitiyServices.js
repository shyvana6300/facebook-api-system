const baseModel = require("../models/baseModel");
const Comment = baseModel.commentModel;
const Status = baseModel.statusModel;
const accountServices = require("./accountServices");

/**
 * 
 * @param {*} email 
 * @param {*} statusImage 
 * @param {*} statusContent 
 * @returns 
 */
const postStatus = async (email, statusImage, statusContent, protocol, host) => {
    console.log("---Called /service postStatus---");
    // get account by email from request
    try {
        const account = await accountServices.findAccountByEmail(email);
        if (!account) {
            return {
                error: true,
                message: 'Account not exist!'
            }
        }
        const accountId = account.id;
        // create StatusObject with data from request
        const statusObject = createStatusObject(statusImage, statusContent, accountId, protocol, host);
        // create new status to DB with StatusObject created
        const newStatus = await Status.create({
            imageUrl: statusObject.imageUrl,
            content: statusObject.content,
            accountId: statusObject.accountId,
        })
        return newStatus;
    } catch (error) {
        throw Error(error.message);
    }
};


const addComment = async (idStatus, idCommenter, content) => {
    console.log("---Called /service postStatus---");
    try {
        // create new comment to DB
        const comment = await Comment.create({
            content: content,
            idCommenter: idCommenter,
            idStatus: idStatus
        })
        return comment;
    } catch (error) {
        throw Error(error.message);
    }
};
/**
 * Create new status object
 * @param {*} statusImage 
 * @param {*} statusContent 
 * @param {*} accountId 
 * @param {*} protocol 
 * @param {*} host 
 * @returns 
 */
const createStatusObject = (statusImage, statusContent, accountId, protocol, host) => {
    const statusObject = {};
    statusContent && (statusObject.content = statusContent);
    statusImage && (statusObject.imageUrl = `${protocol}://${host}/status/${statusImage.originalname}`);
    statusObject.accountId = accountId;
    return statusObject;
}

const getStatusById = async (statusId) => {
    try {
        const status = await Status.findOne({
            where: {
                id: statusId,
            }
        });
        return status;
    } catch (error) {
        throw Error(error.message);
    }
}


module.exports = {
    postStatus: postStatus,
    getStatusById: getStatusById,
    addComment: addComment
}