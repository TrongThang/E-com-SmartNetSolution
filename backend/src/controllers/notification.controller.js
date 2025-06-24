const NotificationService = require('../services/notification.service');

class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
    }

    async getNotifications(req, res, next) {
        try {
            const { filter, limit, sort, order } = req.query;
            const notifications = await this.notificationService.getNotifications(filter, limit, sort, order);
            return res.status(200).json(notifications);
        } catch (error) {
            next(error);
        }
    }

    async createNotification(req, res, next) {
        try {
            const { filter, limit, sort, order } = req.body;
            const notification = await this.notificationService.createNotification(filter, limit, sort, order);
            return res.status(200).json(notification);
        } catch (error) {
            next(error);
        }
    }

    async deleteNotification(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await this.notificationService.deleteNotification(id);
            return res.status(200).json(notification);
        } catch (error) {
            next(error);
        }
    }

    // ===== FCM METHODS =====

    async updateFCMToken(req, res, next) {
        try {
            const { fcm_token } = req.body;
            const account_id = req.user?.account_id;

            const result = await this.notificationService.updateFCMToken(account_id, fcm_token, req.headers['user-agent']);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteDevice(req, res, next) {
        try {
            const account_id = req.user?.account_id;
            const result = await this.notificationService.deleteDevice(account_id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async sendTestNotification(req, res, next) {
        try {
            const account_id = req.user?.account_id;
            const result = await this.notificationService.sendTestNotification(account_id);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationController();