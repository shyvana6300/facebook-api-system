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
        #swagger.description = 'Post new status' */
    console.log("---Called /postStatus---");
    try {
        const result = await activityServices.postStatus(req.email, req.file, req.body.content, req.protocol, req.get("host"));
        if (result.error) {
            /* #swagger.responses[404] = { description: 'Account commented Not Found' } */ 
            return res.status(404).send(result.message);
        }
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
        const result = await activityServices.addComment(req.body.idStatus, req.email, req.body.content);
        if (result.error) {
            /* #swagger.responses[404] = { description: 'Status or commenter not found' } */ 
            return res.status(404).send(result.message);
        }
        /* #swagger.responses[201] = { description: 'Created new comment' } */ 
        res.status(201).send(result);
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
        // call logic to react a status
        const result = await activityServices.reactStatus(req.body.idStatus, req.email);
        if (result.error) {
            /* #swagger.responses[404] = { description: 'Account reactor Not Found' } */ 
            return res.status(404).send(result.message);
        }
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
            const accountEmail = req.email;
            // Validate account exist
            const account = await accountServices.findAccountByEmail(accountEmail);
            /* #swagger.responses[404] = { description: 'User Account or Friend Account Not Found' } */ 
            if (!account) {
                return res.status(404).send('Account not exist!');
            } else {
                const idFriend = req.body.idFriend;
                // Validate friend account
                const friendAccount = await accountServices.getAccountById(idFriend);
                if (!friendAccount) {
                    return res.status(404).send('Friend account is no longer exist!');
                } else if (idFriend == account.id) {
                    return res.status(400).send('Cannot add friend with yourself!');
                } else if (await activityServices.isFriendShipExist(idFriend, account.id)) {
                    return res.status(400).send('Already are friend!');
                } else {
                    // Call service to add new friend
                    result = await activityServices.addFriend(idFriend, account.id);
                    // if (result.error) {
                    //     return res.status(500).send(result.message);
                    // }
                    
                    res.status(201).send(result);
                }
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
        // call logic to react a status
        const result = await activityServices.getTimeline(req.email, req.query.limit, req.query.offset);
        if (result.error) {
            return res.status(404).send(result.message);
        }
        res.status(201).send(result);
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
        const result = await activityServices.getReport(req.email);
        if (result.error) {
            return res.status(404).send(result.message);
        }
        res.status(201).send("Create report successful!");
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