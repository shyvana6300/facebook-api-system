const baseModel = require("../models/baseModel");
const Account = baseModel.accountModel;
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

const createStatusObject = (statusImage, statusContent, accountId, protocol, host) => {
    const statusObject = {};
    statusContent && (statusObject.content = statusContent);
    statusImage && (statusObject.imageUrl = `${protocol}://${host}/status/${statusImage.originalname}`);
    statusObject.accountId = accountId;
    return statusObject;
}

module.exports = {
    postStatus: postStatus,
}