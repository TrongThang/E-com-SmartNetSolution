const { io } = require("socket.io-client");

// Thay các giá trị này bằng giá trị thực tế bạn lấy được
const SOCKET_URL = "http://localhost:8081";
const roomCode = "EXP-CONNNPTKWXTPK924P93S6UOV";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcl9pZCI6MSwicm9vbUNvZGUiOiJFWFAtQ09OTk5QVEtXWFRQSzkyNFA5M1M2VU9WIiwiaWF0IjoxNzQ3NzMzNDcwLCJleHAiOjE3NDc3MzcwNzB9.GEQOVhB1oAAVqMSqJ_KSLn8vIATQ1SHw5UQExtDwSv8";
console.log("Bắt đầu test mobile socket:\n", {
    SOCKET_URL,
    roomCode,
    token
})
const socket = io(SOCKET_URL, {
    auth: { token },
    query: { roomCode }
});

socket.on("connect", () => {
    console.log("Mobile connected to socket!");

    // Gửi dữ liệu lên FE
    socket.emit("mobile_data", {
        // product_id: 1,
        // batch_product_details: [
        //     {
        //         imp_batch_id: 1,
        //         serial_number: "NHƯ heheheheh"
        //     }
        // ]
        // Test nhập sản phẩm
        serial_number: "IMP-12345678912312"
    });

    // Gửi thông tin kết nối (nếu cần)
    socket.emit("mobile_connect", {
        deviceInfo: {
            platform: "mobile",
            user: "test"
        }
    });
});

socket.on("disconnect", () => {
    console.log("Mobile disconnected");
});