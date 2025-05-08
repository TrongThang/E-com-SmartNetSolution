const bcrypt = require('bcrypt');

async function hashPassword(password) {
    console.log('Mật khẩu trước khi băm:', password);  
    const saltRounds = 12; // Độ phức tạp (càng cao càng chậm, càng an toàn)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword; // bcrypt tự động nhúng salt vào hash
}

// Hàm kiểm tra mật khẩu
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    verifyPassword,
};