const util = require("util");
const multer = require("multer");
const maxSize = 2*1024*1024;
global.__basedir = __dirname;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + `/static/img/avatar`);
    },
    filename: (req, file, cb) => {
        console.log("===original filename  = "+file.originalname);
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize}
}).single("file")

// use ulti to make the exported middleware object can be used with async-await
let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;