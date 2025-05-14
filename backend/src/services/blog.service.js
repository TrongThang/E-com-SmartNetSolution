const { STATUS_CODE, ERROR_CODES } = require('../contants/errors');
const { get_error_response } = require('../helpers/response.helper');
const { PrismaClient } = require('@prisma/client');
const { executeSelectData } = require('../helpers/sql_query');

const prisma = new PrismaClient();

const getBlogService = async (filter, limit, sort, order) => {
    let get_attr = `blog.id, blog.id, blog.title, blog.author, blog.content,blog.content_normal, blog.image, blog.score, blog.is_hide,
        categories.name as category_name,
        product.name as product_name,
        employee.surname as author_surname,
        employee.lastname as author_lastname, blog.created_at, blog.updated_at, blog.deleted_at`
    
    let get_table = `blog`
    let query_join = `
        LEFT JOIN categories ON blog.category_id = categories.category_id
        LEFT JOIN product ON blog.product_id = product.id
        LEFT JOIN employee ON blog.author = employee.id
    `

    try {
        const result = await executeSelectData({ 
            table: get_table, 
            queryJoin: query_join, 
            strGetColumn: get_attr, 
            limit: limit, 
            filter: filter, 
            sort: sort, 
            order: order 
        });

        if (result && result.data) {
            // Chuyển đổi kết quả để thêm tên đầy đủ của nhân viên
            const transformedBlogs = result.data.map(blog => ({
                ...blog,
                author: blog.author_surname && blog.author_lastname 
                    ? `${blog.author_surname} ${blog.author_lastname}`
                    : blog.author, // Giữ nguyên mã nếu không có tên
                author_surname: undefined,
                author_lastname: undefined
            }));

            return {
                ...get_error_response(
                    errors=ERROR_CODES.SUCCESS, 
                    status_code=STATUS_CODE.OK, 
                    data=transformedBlogs
                ),
                total: result.total,
                page: result.page,
                limit: result.limit,
                total_page: result.total_page
            };
        }

        return {
            ...get_error_response(
                errors=ERROR_CODES.SUCCESS, 
                status_code=STATUS_CODE.OK, 
                data=[]
            ),
            total: 0,
            page: 1,
            limit: limit,
            total_page: 0
        };
    } catch (error) {
        console.error('Lỗi trong getBlogService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

const getBlogDetailService = async (id) => {
    try {
        const filter = JSON.stringify([
            {
                field: "blog.id",
                condition: "=",
                value: id
            }
        ]);

        let get_attr = `blog.id, blog.id, blog.title, blog.author, blog.content, blog.content_normal, blog.image, blog.score, blog.is_hide,
            categories.name as category_name,
            product.name as product_name,
            employee.surname as author_surname,
            employee.lastname as author_lastname, blog.created_at, blog.updated_at, blog.deleted_at`
        
        let get_table = `blog`
        let query_join = `
            LEFT JOIN categories ON blog.category_id = categories.category_id
            LEFT JOIN product ON blog.product_id = product.id
            LEFT JOIN employee ON blog.author = employee.id
        `

        const result = await executeSelectData({ 
            table: get_table, 
            queryJoin: query_join, 
            strGetColumn: get_attr, 
            filter: filter 
        });

        if (!result || !result.data || result.data.length === 0) {
            return get_error_response(
                errors=ERROR_CODES.BLOG_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Chuyển đổi kết quả để thêm tên đầy đủ của nhân viên
        const transformedBlog = {
            ...result.data[0],
            author: result.data[0].author_surname && result.data[0].author_lastname 
                ? `${result.data[0].author_surname} ${result.data[0].author_lastname}`
                : result.data[0].author, // Giữ nguyên mã nếu không có tên
            author_surname: undefined,
            author_lastname: undefined
        };

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=transformedBlog
        );
    } catch (error) {
        console.error('Lỗi trong getBlogDetailService:', error);
        return get_error_response(
            errors=ERROR_CODES.INTERNAL_SERVER_ERROR, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

const createBlogService = async ({ category_id, product_id, title, author, content, content_normal, image, score, is_hide }) => {
    try {
        // Chuyển đổi category_id và product_id thành số
        const categoryId = category_id ? parseInt(category_id) : null;
        const productId = product_id ? parseInt(product_id) : null;
        const Score = score ? parseInt(score) : null;

        const isHideBoolean = is_hide === "true" || is_hide === true;

        // Kiểm tra category_id nếu có
        if (categoryId) {
            if (isNaN(categoryId)) {
                return get_error_response(
                    errors=ERROR_CODES.BAD_REQUEST,
                    status_code=STATUS_CODE.BAD_REQUEST,
                    data="Invalid category ID format"
                );
            }
            const category = await prisma.categories.findUnique({
                where: { category_id: categoryId }
            });
            if (!category) {
                return get_error_response(
                    errors=ERROR_CODES.CATEGORY_NOT_FOUND,
                    status_code=STATUS_CODE.BAD_REQUEST
                );
            }
        }

        // Kiểm tra product_id nếu có
        if (productId) {
            if (isNaN(productId)) {
                return get_error_response(
                    errors=ERROR_CODES.BAD_REQUEST,
                    status_code=STATUS_CODE.BAD_REQUEST,
                    data="Invalid product ID format"
                );
            }
            const product = await prisma.product.findUnique({
                where: { id: productId }
            });
            if (!product) {
                return get_error_response(
                    errors=ERROR_CODES.PRODUCT_NOT_FOUND,
                    status_code=STATUS_CODE.BAD_REQUEST
                );
            }
        }

        const blog = await prisma.blog.create({
            data: {
                category_id: categoryId,
                product_id: productId,
                title,
                author,
                content,
                content_normal,
                image,
                score: Score,
                is_hide: isHideBoolean,
                created_at: new Date(),
                updated_at: new Date(),
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=blog
        );
    } catch (error) {
        console.error('Error in createBlogService:', error);
        return get_error_response(
           
            errors=ERROR_CODES.BLOG_CREATE_FAILED, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

const updateBlogService = async ({ id, category_id, product_id, title, author, content, content_normal, image, score, is_hide }) => {
    try {
        const existingBlog = await prisma.blog.findUnique({
            where: { id: id }
        });

        if (!existingBlog) {
            return get_error_response(
                errors=ERROR_CODES.BLOG_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Kiểm tra category_id nếu có
        if (category_id) {
            const category = await prisma.categories.findUnique({
                where: { category_id: category_id }
            });
            if (!category) {
                return get_error_response(
                    errors=ERROR_CODES.CATEGORY_NOT_FOUND,
                    status_code=STATUS_CODE.BAD_REQUEST
                );
            }
        }

        // Kiểm tra product_id nếu có
        if (product_id) {
            const product = await prisma.product.findUnique({
                where: { id: product_id }
            });
            if (!product) {
                return get_error_response(
                    errors=ERROR_CODES.PRODUCT_NOT_FOUND,
                    status_code=STATUS_CODE.BAD_REQUEST
                );
            }
        }

        const blog = await prisma.blog.update({
            where: { id: id },
            data: {
                category_id,
                product_id,
                title,
                author,
                content,
                content_normal,
                image,
                score,
                is_hide,
                updated_at: new Date()
            }
        });

        return get_error_response(
            errors=ERROR_CODES.SUCCESS, 
            status_code=STATUS_CODE.OK, 
            data=blog
        );
    } catch (error) {
        console.error('Error in updateBlogService:', error);
        return get_error_response(
            errors=ERROR_CODES.BLOG_UPDATED_FAILED, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteBlogService = async (id) => {
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: id }
        });

        if (!blog) {
            return get_error_response(
                errors=ERROR_CODES.BLOG_NOT_FOUND,
                status_code=STATUS_CODE.NOT_FOUND
            );
        }

        // Thực hiện xóa mềm bằng cách cập nhật deleted_at
        await prisma.blog.update({
            where: { id: id },
            data: {
                deleted_at: new Date()
            }
        });

        return get_error_response(
            errors=ERROR_CODES.BLOG_SUCCESS, 
            status_code=STATUS_CODE.OK
        );
    } catch (error) {
        console.error('Error in deleteBlogService:', error);
        return get_error_response(
            errors=ERROR_CODES.BLOG_DELETED_FAILED, 
            status_code=STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
};

module.exports = {
    getBlogService,
    getBlogDetailService,
    createBlogService,
    updateBlogService,
    deleteBlogService
};

