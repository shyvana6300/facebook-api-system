// const util = require("util");
const multer = require("multer");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./static/img/avatar/`);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
let uploadFile = multer({
    storage: storage
});

// use ulti to make the exported middleware object can be used with async-await
// let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFile;