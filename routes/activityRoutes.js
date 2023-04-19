const express = require('express');
const fileUploader = require('../middleware/fileUploader');
const activityController = require('../controller/activityController');
const activityValidator = require('../middleware/activityValidator');
const authValidator = require('../middleware/authenticationValidator');
const activity_router = express.Router();

activity_router.post('/postStatus',
    [
        authValidator.verifyTokenLogin,
        fileUploader.uploadStatusImage.single('statusImage'),
        activityValidator.validatePostStatus
    ],
    activityController.postStatus);

module.exports = activity_router;