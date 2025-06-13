const { prisma } = require("./query.helper");

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
    
    return importCount._count;
};

async function getExportNumber(export_date) {
    const currentYear = new Date(export_date).getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 1/1 của năm hiện tại
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // 31/12 của năm hiện tại

    const exportCount = await prisma.detail_export.aggregate({
        where: {
            created_at: {
                gte: startOfYear,
                lte: endOfYear
            }
        },
        _count: true
    })

    return exportCount._count;
}

async function getOrderNumber (order_date) {
    const currentYear = new Date(order_date).getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 1/1 của năm hiện tại
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // 31/12 của năm hiện tại
    
    const orderCount = await prisma.order.aggregate({
        where: {
            created_at: {
                gte: startOfYear,
                lte: endOfYear
            }
        },
        _count: true
    });
    
    return orderCount._count;
}

async function generateDetailImportBatchCode(import_date, product_id) {
    const currentYear = new Date(import_date).getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // 1/1 của năm hiện tại
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // 31/12 của năm hiện tại

    const detailImportCount = await prisma.detail_import.aggregate({
        where: {
            created_at: {
                gte: startOfYear,
                lte: endOfYear
            },
            product_id: product_id
        },
        _count: true
    });
    
    return `BATCH_IMP${currentYear}_${product_id}_${detailImportCount._count + 1}`
}

module.exports = {
    getImportNumber,
    getOrderNumber,
    getExportNumber,
    generateDetailImportBatchCode
}