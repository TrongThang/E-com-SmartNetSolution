const { ZodError } = require('zod');

function validateMiddleware(schema) {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                console.log(JSON.stringify(error.errors, null, 2));

                return res.status(400).json({
                    message: 'Dữ liệu không hợp lệ',
                    errors: error.errors.map(err => {
                        const [code, message] = err.message.match(/\[(\d+)\](.+)/).slice(1); // Tách code và message
                        return {
                            path: err.path.join('.'),
                            message,
                            error_code: Number(code),
                            code: err.code,
                        };
                    }),
                });
            }

            // Nếu là lỗi khác
            return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    };
};


module.exports = {
    validateMiddleware,
}