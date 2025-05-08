const { get_error_response } = require('./response.helper');
const QueryHelper = require('./query.helper');

function buildWhereQuery(filter, table = null) {
    let filterObj;
    try {
        filterObj = JSON.parse(filter);
    } catch (e) {
        throw new Error('Invalid filter JSON');
    }
    const sqlConditions = [];
    if (filterObj.length > 0) {
        filterObj.forEach(item => {
            let { field, condition, value } = item;

            switch (condition) {
                case 'contains':
                    if (value) {
                        sqlConditions.push(`(${field} IS NOT NULL AND ${field} LIKE '%${value}%')`);
                    } else {
                        sqlConditions.push(`(${field} LIKE '%%' OR ${field} IS NULL)`);
                    }
                    break;
                case 'notcontains':
                    if (value) {
                        sqlConditions.push(`(${field} IS NOT NULL AND ${field} NOT LIKE '%${value}%')`);
                    } else {
                        sqlConditions.push(`(${field} NOT LIKE '%%')`);
                    }
                    break;
                case 'startswith':
                    if (value) {
                        sqlConditions.push(`(${field} IS NOT NULL AND ${field} LIKE '${value}%')`);
                    } else {
                        sqlConditions.push(`(${field} LIKE '%%' OR ${field} IS NULL)`);
                    }
                    break;
                case 'endswith':
                    if (value) {
                        sqlConditions.push(`(${field} IS NOT NULL AND ${field} LIKE '%${value}')`);
                    } else {
                        sqlConditions.push(`(${field} LIKE '%%' OR ${field} IS NULL)`);
                    }
                    break;
                case '=':
                    sqlConditions.push(`${field} = '${value}'`);
                    break;
                case '<>':
                    sqlConditions.push(`${field} <> '${value}'`);
                    break;
                case '<':
                    sqlConditions.push(`${field} < ${value === '' ? 0 : value}`);
                    break;
                case '>':
                    sqlConditions.push(`${field} > ${value === '' ? 0 : value}`);
                    break;
                case '<=':
                    sqlConditions.push(`${field} <= ${value === '' ? 0 : value}`);
                    break;
                case '>=':
                    sqlConditions.push(`${field} >= ${value === '' ? 0 : value}`);
                    break;
            }
        });
    }

    return sqlConditions.length > 0
        ? `WHERE ${sqlConditions.join(' AND ')} AND ${table}.deleted_at IS NULL`
        : `WHERE ${table}.deleted_at IS NULL`;
}

async function executeSelectData({
    table,
    strGetColumn,
    filter = null,
    limit = null,
    page = null,
    sort = null,
    order = null,
    queryJoin = null,
    configData = null,
}) {
    // Xây dựng WHERE clause
    const buildWhere = filter
        ? buildWhereQuery(filter, table)
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
    const resultIds = idResult.map(row => row.id);

    const whereCondition = resultIds.length
        ? `${table}.id IN (${resultIds.map(id => typeof id === 'string' ? `'${id}'` : id).join(',')})`
        : '1=0';

    // Xử lý các cột thời gian
    const queryGetTime = `${table}.created_at, ${table}.updated_at, ${table}.deleted_at`;

    // Xây dựng câu SQL chính
    const query = `
        SELECT DISTINCT ${queryJoin ? `${table}.` : ''}${idColumn}, ${strGetColumn}, ${queryGetTime}
        FROM ${table}
        ${queryJoin || ''}
        WHERE ${whereCondition}
    `;
    console.log(query)
    
    // Xây dựng câu SQL đếm tổng
    const totalCountQuery = `
        SELECT COUNT(*) AS total 
        FROM ${table}
        ${queryJoin || ''} 
        ${buildWhere}
    `;

    let data = await QueryHelper.queryRaw(query);
    if (configData && typeof configData === 'function') {
        data = configData(data);
    }

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