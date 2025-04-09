const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query'], // Ghi lại các truy vấn SQL ra console
});

module.exports = prisma;