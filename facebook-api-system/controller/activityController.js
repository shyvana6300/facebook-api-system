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
        // Check account exist
        const account = await accountServices.findAccountByEmail(req.email);
        if (!account) {
            return res.status(404).send({ message: 'Account does not exist!' });
        }
        // call service to post new status
        const result = await activityServices.postStatus(account.id, req.file, req.body.content, req.protocol, req.get("host"));
        /* #swagger.responses[201] = { description: 'Created New Status' } */
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Unexpected error occurred when creating new status.");
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
        // Check account exist
        const account = await accountServices.findAccountByEmail(req.email);
        if (!account) {
            return res.status(404).send({ message: 'Account does not exist!' });
        }
        // Check if status exist
        const status = await activityServices.getStatusById(req.body.idStatus);
        if (!status) {
            return res.status(404).send('Status does not exist!');
        }
        // Call service to add new comment
        const result = await activityServices.addComment(status.id, account.id, req.body.content);
        /* #swagger.responses[201] = { description: 'Created new comment' } */
        return res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Unexpected error occurred when adding new comment.");
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
        // Check account exist
        const account = await accountServices.findAccountByEmail(req.email);
        if (!account) {
            return res.status(404).send({ message: 'Account does not exist!' });
        }
        // Check if status exist
        const status = await activityServices.getStatusById(req.body.idStatus);
        if (!status) {
            return res.status(404).send('Status does not exist!');
        }
        // Call service to like/unlike status
        const result = await activityServices.reactStatus(status.id, account.id);
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
            return res.status(400).send(result.message);
        } else {
            /* #swagger.responses[404] = { description: 'User Account or Friend Account Not Found' } */
            // Check account exist
            const account = await accountServices.findAccountByEmail(req.email);
            if (!account) {
                return res.status(404).send({ message: 'Account does not exist!' });
            }
            const idFriend = req.body.idFriend;
            // Validate friend account
            const friendAccount = await accountServices.getAccountById(idFriend);
            if (!friendAccount) {
                return res.status(404).send('Friend account does not exist!');
            } else if (idFriend == account.id) {
                return res.status(400).send('Cannot add friend with yourself!');
            } else if (await activityServices.isFriendShipExist(idFriend, account.id)) {
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
        // Check account exist
        const account = await accountServices.findAccountByEmail(req.email);
        if (!account) {
            return res.status(404).send({ message: 'Account does not exist!' });
        }
        // call service to get timeline
        const result = await activityServices.getTimeline(account.id, req.query.limit, req.query.offset);
        /* #swagger.responses[200] = { description: 'Get timeline successful' } */
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("Unexpected error occurred when getting timeline.");
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
        /* #swagger.responses[404] = { description: 'User Account Does Not Exist' } */
        // Check account exist
        const account = await accountServices.findAccountByEmail(req.email);
        if (!account) {
            return res.status(404).send({ message: 'Account does not exist!' });
        } else if (! await accountServices.checkAuthorizeAdmin(req.email)) {
            return res.status(403).send({ message: 'Account does not have permission to get report' });
        }
        // Call service to get report
        const result = await activityServices.getReport(account.id);
        /* #swagger.responses[201] = { description: 'Create report successful' } */
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Unexpected error occurred when create report.");
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