async function getImportNumber (import_date) {
    // Lấy ngày đầu năm và ngày cuối năm hiện tại
    const currentYear = new Date(import_date).getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 1/1 của năm hiện tại
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // 31/12 của năm hiện tại

    // Đếm số lượng hoá đơn từ đầu năm đến hiện tại
    const importCount = await prisma.import_warehouse.aggregate({
        where: {
            import_date: {
                gte: startOfYear,
                lte: endOfYear
            }
        },
        _count: true
    });
    
    return importCount;
};

module.exports = {
    getImportNumber,
}