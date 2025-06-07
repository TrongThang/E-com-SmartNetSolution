const { get_error_response } = require('./response.helper');
const QueryHelper = require('./query.helper');

function buildWhereQuery(filter, table = null) {
    let filterObj;
    console.log("filter", filter)
    try {
        filterObj = typeof filter === "string" ? JSON.parse(filter) : filter;
    } catch (e) {
        throw new Error('Invalid filter JSON');
    }

    function parseFilter(obj) {
        // Nếu là group
        if (obj.logic && Array.isArray(obj.filters)) {
            const subConditions = obj.filters.map(parseFilter).filter(Boolean);
            if (subConditions.length === 0) return "";
            return `(${subConditions.join(` ${obj.logic} `)})`;
        }
        console.log("obj", obj) 
        // Nếu là filter đơn
        const { field, condition, value } = obj;
        console.log("field", field)
        console.log("condition", condition)
        console.log("value", value)
        switch (condition) {
            case 'contains':
                return value ? `(${field} IS NOT NULL AND ${field} LIKE '%${value}%')` : `(${field} LIKE '%%' OR ${field} IS NULL)`;
            case 'not_contains':
                return value ? `(${field} IS NOT NULL AND ${field} NOT LIKE '%${value}%')` : `(${field} NOT LIKE '%%')`;
            case 'in':
                if (Array.isArray(value) && value.length > 0) {
                    const inList = value.map(v => typeof v === 'string' ? `'${v}'` : v).join(',');
                    return `${field} IN (${inList})`;
                }
                break;
            case 'notin':
                if (Array.isArray(value) && value.length > 0) {
                    const notInList = value.map(v => `'${v}'`).join(',');
                    return `${field} NOT IN (${notInList})`;
                }
                break;
            case 'startswith':
                return value ? `(${field} IS NOT NULL AND ${field} LIKE '${value}%')` : `(${field} LIKE '%%' OR ${field} IS NULL)`;
            case 'endswith':
                return value ? `(${field} IS NOT NULL AND ${field} LIKE '%${value}')` : `(${field} LIKE '%%' OR ${field} IS NULL)`;
            case '=':
                return `${field} = '${value}'`;
            case '<>':
                return `${field} <> '${value}'`;
            case '<':
                return `${field} < ${value === '' ? 0 : value}`;
            case '>':
                return `${field} > ${value === '' ? 0 : value}`;
            case '<=':
                return `${field} <= ${value === '' ? 0 : value}`;
            case '>=':
                return `${field} >= ${value === '' ? 0 : value}`;
            default:
                return "";
        }
        return "";
    }

    // Nếu là group ở root
    let whereClause = "";
    if (filterObj.logic && Array.isArray(filterObj.filters)) {
        const conditions = filterObj.filters.map(parseFilter).filter(Boolean);
        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(` ${filterObj.logic} `)} AND ${table}.deleted_at IS NULL`;
        }
    } else if (Array.isArray(filterObj)) {
        // Nếu là mảng filter đơn giản
        const conditions = filterObj.map(parseFilter).filter(Boolean);
        if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')} AND ${table}.deleted_at IS NULL`;
        }
    }else if (filterObj.field && filterObj.condition && filterObj.value) {
        whereClause = `WHERE ${filterObj.field} ${filterObj.condition} '${filterObj.value}' AND ${table}.deleted_at IS NULL`;
    }

    if (!whereClause) {
        whereClause = `WHERE ${table}.deleted_at IS NULL`;
    }
    return whereClause;
}

async function executeSelectData({
    table,
    strGetColumn,
    filter = null,
    logic = null,
    limit = null,
    page = null,
    sort = null,
    order = null,
    queryJoin = null,
    configData = null,
}) {
    // Xây dựng WHERE clause
    const buildWhere = filter
        ? buildWhereQuery(filter, table, logic)
        : `WHERE ${table}.deleted_at IS NULL`;

    // Xử lý limit, page và offset
    const parsedLimit = limit ? parseInt(limit) : null;
    const parsedPage = page ? parseInt(page) : null;
    const skip = parsedLimit && parsedPage ? parsedLimit * (parsedPage - 1) : 0;

    // Xử lý ORDER BY
    const optOrder = order ? ` ${order.toUpperCase()} ` : '';
    const sortColumn = sort || null;
    const buildSort = sortColumn ? `ORDER BY ${sortColumn} ${optOrder}` : '';
    const buildLimit = parsedLimit ? `LIMIT ${parsedLimit}` : '';
    const buildOffset = skip ? `OFFSET ${skip}` : '';

    // Xác định cột ID dựa trên tên bảng
    const idColumn = table === 'categories' ? 'category_id' : 'id';

    const queryGetIdTable = `
        SELECT DISTINCT ${idColumn}
        FROM (
            SELECT DISTINCT ${table}.${idColumn} ${sort ? `, ${sort} as sort_column` : ''}
            FROM ${table}
            ${queryJoin || ''}
            ${buildWhere}
            ${buildSort}
            ${buildLimit}
            ${buildOffset}
            ) AS sub
    `;

    console.log(queryGetIdTable)
    const idResult = await QueryHelper.queryRaw(queryGetIdTable);
    const resultIds = idResult.map(row => row[idColumn]).filter(id => id !== undefined && id !== null);

    const whereCondition = resultIds.length
        ? `${table}.${idColumn} IN (${resultIds.map(id => typeof id === 'string' ? `'${id}'` : id).join(',')})`
        : '1=0';
    console.log('whereCondition:', whereCondition);
    // Xử lý các cột thời gian
    const queryGetTime = `${table}.created_at, ${table}.updated_at, ${table}.deleted_at`;

    // Xây dựng câu SQL chính
    const queryPrimary = `
        SELECT DISTINCT ${queryJoin ? `${table}.` : ''}${idColumn}, ${strGetColumn}, ${queryGetTime}
        FROM ${table}
        ${queryJoin || ''}
        WHERE ${whereCondition}
        -- GROUP BY ${table}.${idColumn}
        ${buildSort}
    `;
    console.log('queryPrimary:', queryPrimary)
    
    let data = await QueryHelper.queryRaw(queryPrimary);
    if (configData && typeof configData === 'function') {
        data = configData(data);
    }

    // Xây dựng câu SQL đếm tổng
    const totalCountQuery = `
        SELECT COUNT(*) AS total 
        FROM ${table}
        ${queryJoin || ''} 
        ${buildWhere}
    `;

    const totalCountResult = await QueryHelper.queryRaw(totalCountQuery);
    const totalCount = Number(totalCountResult[0].total); // Chuyển BigInt thành Number

    // Tính tổng số trang
    const totalPage = parsedLimit ? Math.ceil(totalCount / parsedLimit) : 1;

    return {
        data,
        total_page: totalPage,
    };
}

async function check_reference_existence(model, column_name, value, error_code) {
    const record = await model.findOne({
        where: {
            [column_name]: value,
            deletedAt: null
        }
    });

    if (record) {
        return {
            status: 401,
            error: get_error_response(error_code = error_code, status_code = 406)
        };
    }

    return null;
};

module.exports = {
    executeSelectData,
    check_reference_existence
}