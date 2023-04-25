const baseModel = require("../models/baseModel");
const QueryTypes = baseModel.sequelize.QueryTypes;
const Reaction = baseModel.reactionModel;
const Comment = baseModel.commentModel;
const FriendShip = baseModel.friendshipModel;
const Status = baseModel.statusModel;
const accountServices = require("./accountServices");
const schema = require('../schema/schema');
const { number } = require("joi");
const Op = baseModel.Sequelize.Op;
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
    console.log("---Called /service addComment---");
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
 * Validate request body of adding friend
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const validateAddingFriend = async (req, res) => {
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
        const friendship = await FriendShip.create({
            idFriend: idFriend,
            accountId: idAccount,
        }, { trasaction: transaction });
        // create new friendship for friend
        const friendshipForFriend = await FriendShip.create({
            idFriend: idAccount,
            accountId: idFriend,
        }, { trasaction: transaction });
        console.log('friendship = ');
        console.log(friendship);
        console.log(friendshipForFriend);
        await transaction.commit();
        return "Create friendship successful!";

    } catch (error) {
        transaction.rollback();
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
            Reaction.destroy({
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
 * Get timeline
 * @param {*} idStatus 
 * @param {*} email 
 * @returns 
 */
const getTimeline = async (email, limitParam, offsetParam) => {
    console.log('===Called getTimeline Service');
    try {
        // Validate email exist
        const account = await accountServices.findAccountByEmail(email);
        if (!account) {
            return {
                error: true,
                message: 'Account not exist!'
            }
        }
        const accountId = account.id;
        const offset = offsetParam ? offsetParam : null;
        const limit = limitParam ? limitParam : null;
        let limitQuery = '';
        if (offset && limit) {
            console.log('=== co ca 2');
            limitQuery = `limit ${offset}, ${limit}`;
        } else if (offset) {
            console.log('=== chi co offset');
            limitQuery = `limit ${offset}`;
        } else if (limit) {
            console.log('=== chi co limit');
            limitQuery = `limit ${limit}`;
        }
        console.log('>>>>> limitQuery = ' + limitQuery);
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
        console.log(records);
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
 * Get report for a week
 * @param {*} email: account email for report
 * @returns 
 */
const getReport = async (email) => {
    try {
        // Validate account exist
        const account = await accountServices.findAccountByEmail(email);
        if (!account) {
            return {
                error: true,
                message: 'Account not exist!'
            }
        }
        // Get count data 
        const idAccount = account.id;
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
        console.log('----statusCount = ');
        console.log(statusCount);
        console.log('----friendCount = ');
        console.log(friendCount);
        console.log('----commentCount = ');
        console.log(commentCount);
        console.log('----likeCount = ');
        console.log(likeCount);
        // Hàng thứ 2
        ws.cell(2, 1).number(statusCount).style(style);
        ws.cell(2, 2).number(friendCount).style(style);
        ws.cell(2, 3).number(commentCount).style(style);
        ws.cell(2, 4).number(likeCount).style(style);

        // Xuất file và lưu vào public/report
        const date = new Date();
        wb.write(`public/report/Report_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.xlsx`);
        return "Create report success!";
    } catch (error) {
        throw new Error(error.message);
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
    await console.log('====status number = ');
    await console.log(numberStatus);
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
    await console.log('====like number = ');
    await console.log(numberLike);
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
    await console.log('====Comment number = ');
    await console.log(numberComment);
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
    await console.log('====Friend number = ');
    await console.log(numberFriend);
    return numberFriend;
}
module.exports = {
    postStatus: postStatus,
    getStatusById: getStatusById,
    addComment: addComment,
    reactStatus: reactStatus,
    addFriend: addFriend,
    validateAddingFriend: validateAddingFriend,
    isFriendShipExist: isFriendShipExist,
    getTimeline: getTimeline,
    getReport: getReport
}