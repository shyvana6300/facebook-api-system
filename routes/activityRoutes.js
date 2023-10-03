const express = require('express');
const fileUploader = require('../middleware/fileUploader');
const activityController = require('../controller/activityController');
const activityValidator = require('../middleware/activityValidator');
const authValidator = require('../middleware/authenValidator');
const activity_router = express.Router();

activity_router.post('/status',
    [
        authValidator.verifyTokenLogin,
        fileUploader.uploadStatusImage.single('statusImage'),
        activityValidator.validatePostStatus
    ],
    activityController.postStatus);

activity_router.post('/status/:statusId/comment', [authValidator.verifyTokenLogin, activityValidator.validateComment], activityController.addComment);

activity_router.post('/status/:statusId/reaction', [authValidator.verifyTokenLogin, activityValidator.validateReaction], activityController.reactStatus);

activity_router.post('/friend/:idFriend', [authValidator.verifyTokenLogin], activityController.addFriend);
activity_router.get('/status', [authValidator.verifyTokenLogin], activityController.getTimeline);
activity_router.get('/report', [authValidator.verifyTokenLogin], activityController.getReport);

module.exports = activity_router;