function diffAttributeSets(request, in_db) {
    const requestMap = new Map();
    const dbMap = new Map();

    request.forEach(item => requestMap.set(item.id, item));
    // in_db.forEach(item => dbMap.set(item.id, item));

    const toAdd = [];
    const toUpdate = [];
    const toDelete = [];

    // Kiểm tra cần thêm mới hoặc cập nhật
    requestMap.forEach((reqItem, id) => {
        const dbItem = dbMap.get(id);
        if (!dbItem) {
            toAdd.push(reqItem);
        } else if (dbItem.value !== reqItem.value) {
            toUpdate.push(reqItem);
        }
    });

    // Kiểm tra cần xóa
    // db = [2, 4, 5], req = [1, 2, 3]

    // => add: 1, 3 -  update: 2 - delete: 4, 5 (db - req)
    dbMap.forEach((dbItem, id) => {
        if (!requestMap.has(id)) {
            toDelete.push(dbItem);
        }
    });

    return { toAdd, toUpdate, toDelete };
}