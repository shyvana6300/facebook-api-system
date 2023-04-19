const activitiyServices = require("../services/activitiyServices");

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

const addComment = (req, res) => {
    console.log("---Called /addComment---");
    res.send(" ---addComment ---");
};
module.exports = {
    postStatus: postStatus,
    addComment: addComment
}