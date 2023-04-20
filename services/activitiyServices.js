const baseModel = require("../models/baseModel");
const Reaction = baseModel.reactionModel;
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

/**
 * Create new comment
 * @param {*} idStatus : id status is commented
 * @param {*} idCommenter : id user comment
 * @param {*} content : comment's content
 * @returns 
 */
const addComment = async (idStatus, email, content) => {
    console.log("---Called /service postStatus---");
    try {
        const account = await accountServices.findAccountByEmail(email);
        if (!account) {
            return {
                error: true,
                message: 'Account not exist!'
            }
        }
        // create new comment to DB
        const comment = await Comment.create({
            content: content,
            idCommenter: account.id,
            idStatus: idStatus
        })
        return comment;
    } catch (error) {
        throw Error(error.message);
    }
};

/**
 * 
 * @param {*} idStatus 
 * @param {*} email 
 * @returns 
 */
const reactStatus = async (idStatus, email) => {
    console.log('===Called reactStatus Service');
    const transaction = await baseModel.sequelize.transaction();
    try {
        const account = await accountServices.findAccountByEmail(email);
        if (!account) {
            return {
                error: true,
                message: 'Account not exist!'
            }
        }
        // Set variable to querry
        const idReactor = account.id;
        const reactionObject = {
            idReactor: idReactor,
            statusId: idStatus 
        }
        // Get Reactor by idReactor + idStatus
        const reaction = await Reaction.findOne({
            where: reactionObject
        });
        // if reaction does not exist
        if (!reaction) {
            // create new Reaction (like)
            const newReaction = Reaction.create(reactionObject, { trasaction: transaction });
            // Commit transaction
            await transaction.commit();
            // Return the reaction created
            return newReaction;
            // else if reaction exist:
        } else {
            // delete reaction (unlike)
            const result = Reaction.destroy({
                where: reactionObject,
                force: true
            }, { trasaction: transaction });
            await transaction.commit();
            return 'React unlike status successful!';
        }
    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
}

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

/**
 * get status by id given
 * @param {*} statusId 
 * @returns 
 */
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
    addComment: addComment,
    reactStatus: reactStatus
}