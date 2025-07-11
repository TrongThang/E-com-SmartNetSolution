const notificationService = require('../services/notification.service');

class NotificationController {
    async getNotificationByAccount(req, res, next) {
        try {
            const account_id = req.user?.userId || req.user?.accountId || req.user?.employeeId;

            const { type } = req.query;

            if (!account_id)
            {
                return res.status(401).json({
                    error: 'Người dùng không hợp lệ'
                });
            }

            const notifications = await notificationService.getNotificationByAccountService(account_id, type);
            return res.status(200).json(notifications);
        } catch (error) {
            next(error);
        }
    }

    async createNotification(req, res, next) {
        try {
            const { filter, limit, sort, order } = req.body;
            const notification = await notificationService.createNotification(filter, limit, sort, order);
            return res.status(200).json(notification);
        } catch (error) {
            next(error);
        }
    }

    async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await notificationService.deleteNotification(id);
            return res.status(200).json(notification);
        } catch (error) {
            next(error);
        }
    }

    // ===== FCM METHODS =====

    updateFCMToken = async (req, res) => {
        try {
            const { deviceToken, deviceId } = req.body;
            const accountId = req?.user?.userId || req?.user?.accountId;
    
            if (!deviceToken) {
                return res.status(400).json({
                    error: 'Device token is required'
                });
            }
    
            if (!accountId) {
                return res.status(401).json({
                    error: 'User not authenticated'
                });
            }
    
            const result = await notificationService.updateFCMToken(accountId, deviceToken, deviceId);
    
            if (result.success) {
                return res.json({
                    message: result.message,
                    deviceId: result.deviceId,
                    note: 'Push notifications are now enabled for this device'
                });
            } else {
                return res.status(404).json({
                    error: result.message
                });
            }
        } catch (error) {
            console.error('Update FCM token error:', error);
            res.status(500).json({
                error: error.message || 'Failed to update FCM token'
            });
        }
    };
    

    async deleteDevice(req, res, next) {
        try {
            const account_id = req.user?.account_id;
            const result = await notificationService.deleteDevice(account_id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async sendTestNotification(req, res, next) {
        try {
            const account_id = req.user?.userId || req.user?.accountId || req.user?.employeeId;
            const result = await notificationService.sendTestNotification(account_id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationController();