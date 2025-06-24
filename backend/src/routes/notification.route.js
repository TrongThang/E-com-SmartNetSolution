const express = require('express');
const { validateMiddleware } = require('../middleware/validate.middleware');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth');

const notificationRouter = express.Router();

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}

// Existing notification routes
notificationRouter.get('/', asyncHandler(notificationController.getNotifications));
notificationRouter.post('/', validateMiddleware(notificationController.CreateNotificationSchema), asyncHandler(notificationController.createNotification));
notificationRouter.delete('/:id', validateMiddleware(notificationController.DeleteNotificationSchema), asyncHandler(notificationController.deleteNotification));

// FCM Routes
notificationRouter.put('/fcm-token', authMiddleware, asyncHandler(notificationController.updateFCMToken));
notificationRouter.delete('/device', authMiddleware, asyncHandler(notificationController.deleteDevice));
notificationRouter.post('/test', authMiddleware, asyncHandler(notificationController.sendTestNotification));

module.exports = notificationRouter;