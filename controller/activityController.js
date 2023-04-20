const activitiyServices = require("../services/activitiyServices");
const accountServices = require("../services/accountServices");

const postStatus = async (req, res) => {
    console.log("---Called /postStatus---");
    try {
        const result = await activitiyServices.postStatus(req.email, req.file, req.body.content, req.protocol, req.get("host"));
        if (result.error) {
            return res.status(404).send(result.message);
        }
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when creating new status."
        });
    }
};

const addComment = async (req, res) => {
    try {
        const result = await activitiyServices.addComment(req.body.idStatus, req.email, req.body.content);
        if (result.error) {
            return res.status(404).send(result.message);
        }
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
    // try {
        console.log("---Called /reactStatus---");
        // call logic to react a status
        const result = await activitiyServices.reactStatus(req.body.idStatus, req.email);
        if (result.error) {
            return res.status(404).send(result.message);
        }
        res.status(201).send(result);
    // } catch (error) {
    //     res.status(500).send({
    //         message: error.message || "Unexpected error occurred when adding new comment."
    //     });
    // }
};
module.exports = {
    postStatus: postStatus,
    addComment: addComment,
    reactStatus: reactStatus
}