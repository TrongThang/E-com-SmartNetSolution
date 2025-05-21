const express = require('express');
const router = express.Router();
const socketQRController = require('../controllers/socketQR.controller');


// Route để tạo mã kết nối mới
router.post('/generate', socketQRController.generateConnectionCode);

// Route để xác thực kết nối từ mobile
router.post('/verify', socketQRController.verifyConnection);

module.exports = router; 