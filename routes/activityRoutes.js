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
// update October 2023
activity_router.put('/status/:statusId/comments/:commentId', [authValidator.verifyTokenLogin, activityValidator.validateComment], activityController.editComment);
activity_router.get('/status/comments', [authValidator.verifyTokenLogin], activityController.getAllComment);
// activity_router.delete('/status/:statusId/comments/:commentId')
activity_router.post('/status/:statusId/reaction', [authValidator.verifyTokenLogin, activityValidator.validateReaction], activityController.reactStatus);

activity_router.post('/friend/', [authValidator.verifyTokenLogin], activityController.addFriend);
activity_router.get('/status', [authValidator.verifyTokenLogin], activityController.getTimeline);
activity_router.get('/report', [authValidator.verifyTokenLogin], activityController.getReport);

module.exports = activity_router;