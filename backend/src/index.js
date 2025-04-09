const express = require('express');
require('dotenv').config();
const configServer = require('./config/server');
const connection = require('./config/database');

const app = express();
const port = process.env.PORT || 8081;

configServer(app);

const routeAPI = require('./routes/routeAPI');
app.use('/api', routeAPI);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API server is running',
    });
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
});

// Đóng kết nối Prisma khi server dừng
process.on('SIGTERM', async () => {
    await connection.$disconnect();
    process.exit(0);
});