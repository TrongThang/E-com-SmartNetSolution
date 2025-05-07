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

    async isExistId (id, model) {
        if (model && typeof model.findByPk === 'function') {
            const existingRecord = await model.findByPk(id);
            return existingRecord;
        }
        return false;
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