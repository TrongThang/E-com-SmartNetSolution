const express = require('express');
const http = require('http');
require('dotenv').config();
const morgan = require('morgan'); // Thêm morgan để ghi log
const configServer = require('./config/server');
const connection = require('./config/database');
const { initializeSocket } = require('./services/socketQR.service');
const app = express();
const port = process.env.PORT || 8081;

// Định nghĩa định dạng tùy chỉnh cho morgan
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('query', (req) => JSON.stringify(req.query));
morgan.token('time', (req, res) => {
    const time = new Date().toLocaleString();
    return `${time}`;
});
app.use(
    morgan(
        'Time: :time | ' +
        '🚀 :method :url :status :response-time ms'
    )
);

configServer(app);

const routeAPI = require('./routes');
app.use('/api', routeAPI);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API server is running',
    });
});

// **Tạo http.Server từ app**
const server = http.createServer(app);

// **Khởi tạo socket.io trên server này**
const io = initializeSocket(server);

// **Lắng nghe trên server**
server.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});

// Đóng kết nối Prisma khi server dừng
process.on('SIGTERM', async () => {
    await connection.$disconnect();
    process.exit(0);
});