const prisma = require('../config/database');

async function isDescendant(childId, parentId) {
    try {
        let current = await prisma.categories.findUnique({ 
            where: { category_id: parentId } 
        });
        
        if (!current) {
            console.error(`Category with ID ${parentId} not found`);
            return false;
        }

        while (current && current.parent_id) {
            if (current.parent_id === childId) {
                return true;
            }
            current = await prisma.categories.findUnique({ 
                where: { category_id: current.parent_id } 
            });
        }
        return false;
    } catch (error) {
        console.error('Error in isDescendant:', error);
        throw error;
    }
}

module.exports = {
    isDescendant
}