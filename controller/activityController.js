const activitiyServices = require("../services/activitiyServices");
const accountServices = require("../services/accountServices");

const postStatus = async (req, res) => {
    console.log("---Called /postStatus---");
    console.log("~~~~account email = " + req.email);
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
        // check account exist
        const account = await accountServices.findAccountByEmail(req.email);
        if (!account) {
            return res.status(404).send({ message: "Account not exist!" });
        } else {
            const result = await activitiyServices.addComment(req.body.idStatus, account.id, req.body.content);
            if (result.error) {
                return res.status(404).send(result.message);
            }
            res.status(201).send(result);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when adding new comment."
        });
    }
};
module.exports = {
    postStatus: postStatus,
    addComment: addComment
}