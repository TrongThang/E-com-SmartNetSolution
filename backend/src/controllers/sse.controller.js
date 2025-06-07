const { Request, Response } = require('express');

class SSEController {
    constructor() {
        if (!SSEController.instance) {
            SSEController.instance = this;
            this.clients = [];
        }
        return SSEController.instance;
    }

    async getEvents(req, res) {
        try {
            if (res.headersSent) return;

            console.log('getEvents - Starting new connection');

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.flushHeaders();

            const clientId = Date.now();
            const newClient = { id: clientId, res };

            this.clients.push(newClient);
            console.log(`New client connected. ID: ${clientId}. Total clients: ${this.clients.length}`);

            res.write(`data: ${JSON.stringify({ 
                type: 'connected',
                message: 'Connected to SSE' 
            })}\n\n`);

            req.on('close', () => {
                this.clients = this.clients.filter(client => client.id !== clientId);
                console.log(`Client ${clientId} disconnected. Remaining clients: ${this.clients.length}`);
            });

        } catch (error) {
            console.error('Error in getEvents:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    postSomeAction(req, res) {
        const result = { success: true, data: req.body };

        this.sendNotificationToAllClients({
            message: 'API call successful!',
            data: result,
        });

        res.json(result);
    }

    sendNotificationToAllClients(payload) {
        this.clients.forEach(client => {
            client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
        });
    }

    sendProductionUpdate(payload) {
        console.log('Sending production update to clients:', payload);
        this.clients.forEach(client => {
            try {
                client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
            } catch (error) {
                console.error('Error sending to client:', error);
                this.clients = this.clients.filter(c => c.id !== client.id);
            }
        });
    }

    sendImportWarehouseUpdate(payload) {
        console.log('Sending import warehouse update to clients:', payload);
        this.clients.forEach(client => {
            try {
                client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
            } catch (error) {
                console.error('Error sending to client:', error);
                this.clients = this.clients.filter(c => c.id !== client.id);
            }
        });
    }

    getConnectedClientsCount() {
        return this.clients.length;
    }
}

// Singleton export
const instance = new SSEController();
Object.freeze(instance);

module.exports = instance;
