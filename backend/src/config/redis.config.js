const redis = require('redis');

let redisClient;

const initRedis = async () => {
    try {
        redisClient = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            retry_strategy: (options) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    console.error('Redis server connection refused.');
                    return new Error('Redis server connection refused');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    console.error('Redis retry time exhausted.');
                    return new Error('Retry time exhausted');
                }
                if (options.attempt > 10) {
                    console.error('Redis connection attempts exceeded.');
                    return undefined;
                }
                return Math.min(options.attempt * 100, 3000);
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
        });

        redisClient.on('ready', () => {
            console.log('Redis Client Ready');
        });

        redisClient.on('end', () => {
            console.log('Redis Client Disconnected');
        });

        await redisClient.connect();
        console.log('✅ Redis connected successfully');
        
    } catch (error) {
        console.error('❌ Redis connection failed:', error);
        // Không throw error để app vẫn chạy được khi không có Redis
    }
};

const getRedisClient = () => {
    if (!redisClient) {
        console.warn('Redis client not initialized');
        return null;
    }
    return redisClient;
};

const closeRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
        console.log('Redis connection closed');
    }
};

module.exports = {
    initRedis,
    getRedisClient,
    closeRedis,
    redisClient: getRedisClient
};