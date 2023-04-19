const activitiyServices = require("../services/activitiyServices");

const postStatus = async (req, res) => {
    console.log("---Called /postStatus---");
    console.log("~~~~account email = " + req.email);
    try {
        const newStatus = await activitiyServices.postStatus(req.email, req.file, req.body.content, req.protocol, req.get("host"));
        res.status(201).send(newStatus);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Unexpected error occurred when creating new status."
        });
    }
};

module.exports = {
    postStatus: postStatus,
}