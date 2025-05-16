const { PrismaClient, sql } = require('@prisma/client');

class QueryHelper {
    constructor() {
        this.prisma = new PrismaClient();
    }

    // Hàm chạy truy vấn SELECT, trả về dữ liệu
    async queryRaw(query, params = []) {
        return await this.prisma.$queryRaw(sql([query], ...params));
    }

    // Hàm chạy truy vấn INSERT, UPDATE, DELETE
    // async executeRaw(query, params = []) {
    //     return await this.prisma.$executeRaw(sql([query], ...params));
    // }

    /**
     * Kiểm tra xem một bản ghi có tồn tại theo ID trong một model Prisma.
     * @param {string|number} id - ID của bản ghi cần kiểm tra.
     * @param {object} model - Prisma model (VD: prisma.user, prisma.post, ...).
     * @returns {Promise<object|false>} - Trả về bản ghi nếu tồn tại, ngược lại trả về false.
     */
    async isExistId (id, model) {
        if (model && typeof model.findFirst === 'function') {
            // Convert id to integer if it's a string
            const numericId = typeof id === 'string' ? parseInt(id) : id;
            
            // Check if the conversion was successful
            if (isNaN(numericId)) {
                return undefined;
            }

            const existingRecord = await model.findFirst({
                where: {
                    id: numericId,
                    deleted_at: null
                }
            });
            return existingRecord || undefined;
        }
        return undefined;
    };
    
    async disconnect() {
        await this.prisma.$disconnect();
    }
}

module.exports = new QueryHelper();
// Usage example
// const queryHelper = require('./query_helper');
// const result = await queryHelper.queryRaw('SELECT * FROM users WHERE id = ?', [1]);
// console.log(result);