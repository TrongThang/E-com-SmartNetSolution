const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.AIVEN_URL,
        },
    },
    log: ['query', 'info', 'warn', 'error'],
});

// Cấu hình connection pool
prisma.$connect().then(() => {
    console.log('Database connected with optimized configuration');
}).catch((error) => {
    console.error('Database connection failed:', error);
});

// Xử lý lỗi kết nối
prisma.$on('query', (e) => {
    if (e.duration > 5000) { // Log các truy vấn chậm
        console.warn(`Phát hiện truy vấn chậm: ${e.query} (${e.duration}ms)`);
    }
});

module.exports = prisma;