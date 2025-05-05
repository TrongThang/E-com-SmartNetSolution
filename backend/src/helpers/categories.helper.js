async function isDescendant(childId, parentId) {
    let current = await prisma.categories.findUnique({ where: { category_id: parentId } });
    while (current && current.parent_id) {
        if (current.parent_id === childId) {
            return true; // Gây vòng lặp
        }
        current = await prisma.categories.findUnique({ where: { category_id: current.parent_id } });
    }
    return false;
}

module.exports = {
    isDescendant
}