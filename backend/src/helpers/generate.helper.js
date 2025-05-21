const { v4: uuidV4 } = require("uuid");
const crypto = require("crypto");

// Generate a dynamic seed using APP_SECRET and caller-provided input
const generateDynamicSeed = (callerInput) => {
    const internalValue = process.env.APP_SECRET || "pMqH9zVM+0ENpDS/BF6ASyF0RgCPvTxyQh5seLYllsajYqH37xbYUeRoEITnGWDz"; // Fallback if no APP_SECRET
    const combinedValue = `${internalValue}${callerInput}`; // Combine static secret with dynamic input
    return crypto.createHash("sha256").update(combinedValue).digest().slice(0, 16); // 16-byte seed
};

// Generate prefixed UUID within 32 characters
function generatePrefixedUUID(prefix, callerInput) {
    const dynamicSeed = generateDynamicSeed(callerInput); // Use caller input for seed
    const baseUUID = uuidV4({ random: dynamicSeed }); // Generate UUID with dynamic seed
    const base36UUID = BigInt(`0x${baseUUID.replace(/-/g, "")}`).toString(36); // Convert to Base-36
    const shortUUID = base36UUID.slice(0, 28 - prefix.length); // Adjust length (28 = 32 - prefix length)
    return `${prefix}${shortUUID}`.toUpperCase(); // Total length ≤ 32
}

// Usage with Date.now() as default caller input
function generateAccountId(input = Date.now()) {
    return generatePrefixedUUID("ACCT", input);
}

const generateCustomerId = (input = Date.now()) => generatePrefixedUUID("CUST", input);
const generateEmployeeId = (input = Date.now()) => generatePrefixedUUID("EMPL", input);
const generateExportSocketQRId = (input = Date.now()) => generatePrefixedUUID("EXP-CONN", input);

function generateVerificationOTPCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo số ngẫu nhiên từ 100000 đến 999999
}

function generateImportID(importNumber, import_date) {
    const currentYear = new Date(import_date).getFullYear();
    // Tạo số hoá đơn mới
    // Format: NK + Năm + Số thứ tự (4 chữ số)
    // Ví dụ: NK-2024-0001, NK-2024-0002,...
    const newImportNumber = `NK-${currentYear}-${String(importNumber).padStart(4, '0')}`;

    return newImportNumber;
};

function generateOrderID(orderNumber) {
    const currentYear = new Date().getFullYear();
    return `DH-${currentYear}-${String(orderNumber).padStart(4, '0')}`;
}

function generateExportNumber(exportNumber) {
    const currentYear = new Date().getFullYear();
    return `XK-${currentYear}-${String(exportNumber).padStart(6, '0')}`;
}

module.exports = {
    generateAccountId,
    generateCustomerId,
    generateEmployeeId,
    generateVerificationOTPCode,
    generateImportID,
    generateOrderID,
    generateExportNumber,
    generateExportSocketQRId
} 