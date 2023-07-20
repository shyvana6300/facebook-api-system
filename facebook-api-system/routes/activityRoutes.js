const express = require('express');
const fileUploader = require('../middleware/fileUploader');
const activityController = require('../controller/activityController');
const activityValidator = require('../middleware/activityValidator');
const authValidator = require('../middleware/authenValidator');
const activity_router = express.Router();

activity_router.post('/postStatus',
    [
        authValidator.verifyTokenLogin,
        fileUploader.uploadStatusImage.single('statusImage'),
        activityValidator.validatePostStatus
    ],
    activityController.postStatus);

activity_router.post('/addComment', [authValidator.verifyTokenLogin, activityValidator.validateComment], activityController.addComment);

activity_router.post('/reactStatus', [authValidator.verifyTokenLogin, activityValidator.validateReaction], activityController.reactStatus);

activity_router.post('/addFriend', [authValidator.verifyTokenLogin], activityController.addFriend);
activity_router.get('/timeline', [authValidator.verifyTokenLogin], activityController.getTimeline);
activity_router.get('/report', [authValidator.verifyTokenLogin], activityController.getReport);

module.exports = activity_router;