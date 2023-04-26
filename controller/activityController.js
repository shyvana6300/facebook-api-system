const activityServices = require("../services/activityServices");
const accountServices = require("../services/accountServices");

/**
 * Handle post status request
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const postStatus = async (req, res) => {
    /* 	#swagger.tags = ['Activity']
        #swagger.description = 'Post new status' 
        
        #swagger.parameters['Status Image'] = {
            in: 'formData',
            type: 'file',
            description: 'Upload status image',
        }
        */

    console.log("---Called /postStatus---");
    try {
        /* #swagger.responses[404] = { description: 'Account commented Not Found' } */
        // get account Id if exist
        const accountId = await accountServices.getAccountIdIfExist(req, res);
        // call service to post new status
        const result = await activityServices.postStatus(accountId, req.file, req.body.content, req.protocol, req.get("host"));
        /* #swagger.responses[201] = { description: 'Created New Status' } */
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when creating new status."
        });
    }
};

/**
 * Handle add new comment request
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addComment = async (req, res) => {
    /* 	#swagger.tags = ['Activity']
        #swagger.description = 'Add a new comment' */
    try {
        /* #swagger.responses[404] = { description: 'Status or commenter not found' } */
        // get account id if account exist
        // TODO: S.O.S cần làm ngay sáng mai -> sửa chỗ này sau khi merge 2 hàm getAccount Id vs findAccount by email
        // -> getAccountIfExist(email, res)
        const account = await accountServices.getAccountIdIfExist(req, res);
        // Check if status exist
        await checkStatusExist(req, res);
        const result = await activityServices.addComment(req.body.idStatus, account.id, req.body.content);
        /* #swagger.responses[201] = { description: 'Created new comment' } */
        return res.status(201).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when adding new comment."
        });
    }
};

/**
 * React a status
 * @param {*} req 
 * @param {*} res 
 */
const reactStatus = async (req, res) => {
    /* 	#swagger.tags = ['Activity']
    #swagger.description = 'Like/Unlike a status' */
    try {
        console.log("---Called /reactStatus---");
        /* #swagger.responses[404] = { description: 'Status of account reactor Not Found' } */
        // get account id if account exist
        const accountId = await accountServices.getAccountIdIfExist(req, res);
        // Check if status exist
        await checkStatusExist(req, res);
        // call logic to react a status
        const result = await activityServices.reactStatus(req.body.idStatus, accountId);
        /* #swagger.responses[201] = { description: 'Like/Unlike successful' } */
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Unexpected error occurred when react status.");
    }
};

/**
 * Add new friend to account
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const addFriend = async (req, res) => {
    /* 	#swagger.tags = ['Activity']
    #swagger.description = 'Add a friend' */
    console.log("---Called /addFriend---");
    try {
        // Call service to validate request
        let result = await activityServices.validateAddingFriend(req);
        if (result.error) {
            return res.status(404).send(result.message);
        } else {
            /* #swagger.responses[404] = { description: 'User Account or Friend Account Not Found' } */
            // get account id if account exist
            const accountId = await accountServices.getAccountIdIfExist(req, res);
                const idFriend = req.body.idFriend;
                // Validate friend account
                const friendAccount = await accountServices.getAccountById(idFriend);
                if (!friendAccount) {
                    return res.status(404).send('Friend account is no longer exist!');
                } else if (idFriend == account.id) {
                    return res.status(400).send('Cannot add friend with yourself!');
                } else if (await activityServices.isFriendShipExist(idFriend, accountId)) {
                    return res.status(400).send('Already are friend!');
                } else {
                    // Call service to add new friend
                    result = await activityServices.addFriend(idFriend, account.id);
                    /* #swagger.responses[201] = { description: 'Add friend successful' } */
                    res.status(201).send(result);
                }
            

        }

    } catch (error) {
        res.status(500).send("Unexpected error occurred while adding friend.");
    }
}

/**
 * Get timeline
 * @param {*} req 
 * @param {*} res 
 */
const getTimeline = async (req, res) => {
    /* 	#swagger.tags = ['Activity']
    #swagger.description = 'Timeline of friend activity' */
    try {
        console.log("---Called /getTimeline---");
        // get account id if account exist
        const accountId = await accountServices.getAccountIdIfExist(req, res);
        // call service to get timeline
        const result = await activityServices.getTimeline(accountId, req.query.limit, req.query.offset);
        if (result.error) {
            return res.status(404).send(result.message);
        }
        /* #swagger.responses[200] = { description: 'Get timeline successful' } */
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Unexpected error occurred when react status.");
    }
}

/**
 * Get Report
 * @param {*} req 
 * @param {*} res 
 */
const getReport = async (req, res) => {
    /* 	#swagger.tags = ['Activity']
    #swagger.description = 'Get report of account activity pass a week' */
    try {
        console.log("---Called /getReport---");
        /* #swagger.responses[404] = { description: 'User Account Not Found' } */
        // get account id if account exist
        const accountId = await accountServices.getAccountIdIfExist(req, res);
        // Call service to get report
        const result = await activityServices.getReport(accountId);
        if (result.error) {
            return res.status(404).send(result.message);
        }
        /* #swagger.responses[201] = { description: 'Create report successful' } */
        res.status(201).send("Create report successful!");
    } catch (error) {
        res.status(500).send("Unexpected error occurred when create report.");
    }
}

/**
 * Check if status with given id exist
 * @param {*} statusId 
 * @returns check: true if status exist | false if status not exist
 */
const checkStatusExist = async (req, res) => {
    try {
        const checkStatus = await activityServices.getStatusById(req.body.idStatus);
        if (!checkStatus) {
            return res.status(404).send('Status does not exist!');
        }
        // Done:confirm xem có cần check account sở hữu status có còn tồn tại ko? 
        //=> test thử khi xóa account thì có xóa các bài viết của account đó không.
        //=> kq: xóa account thì id của account trong các stt và comment sẽ thành null
        //=> Đã validate trong service
    } catch (error) {
        throw Error('An unexpected error occurred while checking status exist!');
    }
}
module.exports = {
    postStatus: postStatus,
    addComment: addComment,
    reactStatus: reactStatus,
    addFriend: addFriend,
    getTimeline: getTimeline,
    getReport: getReport
}