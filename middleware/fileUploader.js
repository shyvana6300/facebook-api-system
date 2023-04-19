// const util = require("util");
const multer = require("multer");

const setStorage = (filePath) => {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, filePath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
    return storage;
}

const uploadFile = (filePath) => {
    const storage = setStorage(filePath);
    let uploadFile = multer({
        storage: storage
    });
    return uploadFile;
}

const uploadAvatar = uploadFile(`./static/img/avatar/`);
const uploadStatusImage = uploadFile(`./static/img/status/`)
module.exports = {
    uploadAvatar: uploadAvatar,
    uploadStatusImage: uploadStatusImage
}