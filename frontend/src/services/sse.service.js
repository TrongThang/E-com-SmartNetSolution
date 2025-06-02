class SSEService {
    constructor() {
        this.eventSource = null;
        this.listeners = new Map();
    }

    connect() {
        if (this.eventSource) {
            return;
        }

        this.eventSource = new EventSource('http://localhost:8888/api/sse/events');

        this.eventSource.onopen = () => {
            console.log('SSE connection established');
        };

        this.eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            this.reconnect();
        };

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('Error parsing SSE message:', error);
            }
        };
    }

    reconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    handleMessage(data) {
        const { type, device_serial, stage, status, stage_log } = data;

        // Notify all listeners for this type of event
        if (this.listeners.has(type)) {
            this.listeners.get(type).forEach(callback => {
                callback({ device_serial, stage, status, stage_log });
            });
        }
    }

    addEventListener(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);
    }

    removeEventListener(type, callback) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).delete(callback);
        }
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.listeners.clear();
    }
}

// Create a singleton instance
const sseService = new SSEService();
export default sseService; 