const baseModel = require("../models/baseModel");
const QueryTypes = baseModel.sequelize.QueryTypes;
const Reaction = baseModel.reactionModel;
const Comment = baseModel.commentModel;
const FriendShip = baseModel.friendshipModel;
const Status = baseModel.statusModel;
const schema = require('../schema/schema');
const Op = baseModel.Sequelize.Op;
/**
 * 
 * @param {*} email 
 * @param {*} statusImage 
 * @param {*} statusContent 
 * @returns 
 */
const postStatus = async (accountId, statusImage, statusContent, protocol, host) => {
    console.log("---Called /service postStatus---");
    const transaction = await baseModel.sequelize.transaction();
    // get account by email from request
    try {
        // create StatusObject with data from request
        const statusObject = createStatusObject(statusImage, statusContent, accountId, protocol, host);
        // create new status to DB with StatusObject created
        const newStatus = await Status.create({
            imageUrl: statusObject.imageUrl,
            content: statusObject.content,
            accountId: statusObject.accountId,
        }, { trasaction: transaction });
        await transaction.commit();
        return newStatus;
    } catch (error) {
        await transaction.rollback();
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
const addComment = async (idStatus, idAccount, content) => {
    console.log("---Called /service addComment---");
    const transaction = await baseModel.sequelize.transaction();
    try {
        // create new comment to DB
        const comment = await Comment.create({
            content: content,
            idCommenter: idAccount,
            idStatus: idStatus
        }, { trasaction: transaction });
        await transaction.commit();
        return comment;
    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
};

/**
 * Validate request body of adding friend
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const validateAddingFriend = async (req) => {
    let result = await schema.schemaFriendship.validate(req.body);
    if (result.error) {
        return {
            error: true,
            message: result.error.details[0].message
        }
    }
    return result
}

/**
 * Check if friendship exist
 * @param {*} idFriend 
 * @param {*} idAccount
 * Return: true - friendship exist/ false: friendship not exist 
 */
const isFriendShipExist = async (idFriend, idAccount) => {
    const friendship = await FriendShip.findOne({
        where: {
            idFriend: parseInt(idFriend),
            accountId: idAccount
        }
    });
    if (!friendship) return false;
    else {
        return true;
    }
}
/**
 * Add new friend to user
 * @param {*} idStatus 
 * @param {*} email 
 * @returns 
 */
const addFriend = async (idFriend, idAccount) => {
    console.log("---Called /service addFriend---");
    const transaction = await baseModel.sequelize.transaction();
    try {
        // create new friendship for user
        await FriendShip.create({
            idFriend: idFriend,
            accountId: idAccount,
        }, { trasaction: transaction });
        // create new friendship for friend
        await FriendShip.create({
            idFriend: idAccount,
            accountId: idFriend,
        }, { trasaction: transaction });
        await transaction.commit();
        return "Create friendship successful!";

    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
};
/**
 * 
 * @param {*} idStatus 
 * @param {*} email 
 * @returns 
 */
const reactStatus = async (idStatus, idReactor) => {
    console.log('===Called reactStatus Service');
    const transaction = await baseModel.sequelize.transaction();
    let result;
    try {
        const reactionObject = {
            idReactor: idReactor,
            statusId: idStatus
        }
        // Get Reactor by idReactor + idStatus
        const reaction = await Reaction.findOne({
            where: reactionObject
        });
        // If reaction does not exist
        if (!reaction) {
            // Create new Reaction (like)
            const newReaction = Reaction.create(reactionObject, { trasaction: transaction });

            // Set the reaction created to result for returning
            result = newReaction;
            // Else if reaction exist
        } else {
            // Delete reaction (unlike)
            Reaction.destroy({
                where: reactionObject,
                force: true
            }, { trasaction: transaction });
            // Set message success to result
            result = 'React unlike status successful!';
        }
        // Commit transaction
        await transaction.commit();
        // Return result 
        return result;
    } catch (error) {
        await transaction.rollback();
        throw Error(error.message);
    }
}

/**
 * Get timeline
 * @param {*} idStatus 
 * @param {*} email 
 * @returns 
 */
const getTimeline = async (accountId, limitParam, offsetParam) => {
    try {
        const offset = offsetParam ? offsetParam : null;
        const limit = limitParam ? limitParam : null;
        let limitQuery = '';
        if (offset && limit) {
            limitQuery = `limit ${offset}, ${limit}`;
        } else if (offset) {
            limitQuery = `limit ${offset}`;
        } else if (limit) {
            limitQuery = `limit ${limit}`;
        }
        // select all status of account's friends
        const records = await baseModel.sequelize.query(
            `SELECT st.id idStatus, st.*, email, fr.accountId, idFriend
            FROM facebook_api_db.friendships as fr
            left join facebook_api_db.accounts as ac
            on fr.accountId = ac.id
            left join facebook_api_db.statuses as st
            on st.accountId = fr.idFriend
            where fr.accountId = ${accountId}
            order by updatedAt desc
            ${limitQuery}`,
            {
                type: QueryTypes.SELECT
            });
        return records;
    } catch (error) {
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
 * Get report for a week
 * @param {*} email: account email for report
 * @returns 
 */
const getReport = async (idAccount) => {
    try {
        const statusCount = await getStatusReport(idAccount);
        const likeCount = await getLikeReport(idAccount);
        const commentCount = await getCommentReport(idAccount);
        const friendCount = await getFriendReport(idAccount);
        // Create Excel file
        const xl = require('excel4node');

        const wb = new xl.Workbook();

        const ws = wb.addWorksheet('Sheet 1');

        let style = wb.createStyle({
            font: {
                color: '#FF0800',
                size: 12
            },
            numberFormat: '##0'
        });

        // Hàng đầu tiên trong file excel
        ws.cell(1, 1).string('Số bài đã viết tuần qua').style(style);
        ws.cell(1, 2).string('Số bạn bè mới tuần qua').style(style);
        ws.cell(1, 3).string('Số comment mới tuần qua').style(style);
        ws.cell(1, 4).string('Số like mới tuần qua').style(style);
        // Hàng thứ 2
        ws.cell(2, 1).number(statusCount).style(style);
        ws.cell(2, 2).number(friendCount).style(style);
        ws.cell(2, 3).number(commentCount).style(style);
        ws.cell(2, 4).number(likeCount).style(style);
        // Xuất file và lưu vào public/report
        const date = new Date();
        wb.write(`public/report/Report_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.xlsx`);
        return "Create report successful!";
    } catch (error) {
        throw new Error(error.message);
    }
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

/**
 * Get the number of new status in the past 1 week
 * @param {*} accountId current account for report
 */
const getStatusReport = async (accountId) => {
    const numberStatus = await Status.count({
        col: 'id',
        where: {
            accountId: accountId,
            [Op.and]: [
                baseModel.Sequelize.literal(`createdAt  >= now() - interval 7 day`),
            ],
        }
    });
    return numberStatus;
}

/**
 * Get the number of new likes in the past 1 week
 * @param {*} accountId 
 */
const getLikeReport = async (accountId) => {
    const numberLike = await Reaction.count({
        col: 'id',
        where: {
            idReactor: accountId,
            [Op.and]: [
                baseModel.Sequelize.literal(`createdAt  >= now() - interval 7 day`),
            ],
        }
    });
    return numberLike;
}

/**
 * Get the number of new commentin the past 1 week
 * @param {*} accountId 
 */
const getCommentReport = async (accountId) => {
    const numberComment = await Comment.count({
        col: 'id',
        where: {
            idCommenter: accountId,
            [Op.and]: [
                baseModel.Sequelize.literal(`createdAt  >= now() - interval 7 day`),
            ],
        }
    });
    return numberComment;
}

/**
 * Get the number of new friends in the past 1 week
 * @param {*} accountId 
 */
const getFriendReport = async (accountId) => {
    const numberFriend = await FriendShip.count({
        col: 'id',
        where: {
            accountId: accountId,
            [Op.and]: [
                baseModel.Sequelize.literal(`createdAt  >= now() - interval 7 day`),
            ],
        }
    });
    return numberFriend;
}
module.exports = {
    postStatus: postStatus,
    addComment: addComment,
    validateAddingFriend: validateAddingFriend,
    isFriendShipExist: isFriendShipExist,
    addFriend: addFriend,
    reactStatus: reactStatus,
    getTimeline: getTimeline,
    getReport: getReport,
    getStatusById: getStatusById,
}