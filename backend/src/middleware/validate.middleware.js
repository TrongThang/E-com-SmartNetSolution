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
                console.log('=== VALIDATION ERRORS ===');
                console.log('Raw errors:', JSON.stringify(error.errors, null, 2));
                
                const formattedErrors = error.errors.map(err => {
                    console.log('Processing error:', err);
                    console.log('Error message:', err.message);
                    
                    const match = err.message.match(/\[(\d+)\](.+)/);
                    console.log('Match result:', match);
                    
                    let code, message;
                    if (match) {
                        [code, message] = match.slice(1);
                        console.log('Extracted code:', code);
                        console.log('Extracted message:', message);
                    } else {
                        code = 0;
                        message = err.message;
                        console.log('No match found, using default values');
                    }
                    
                    return {
                        path: err.path.join('.'),
                        content: err.path[0],
                        field: err.path[1],
                        message,
                        error_code: Number(code),
                        code: err.code,
                    };
                });

                console.log('Formatted errors:', JSON.stringify(formattedErrors, null, 2));
                console.log('=== END VALIDATION ERRORS ===');

                return res.status(400).json({
                    message: 'Dữ liệu không hợp lệ',
                    errors: formattedErrors,
                });
            }

            // Nếu là lỗi khác
            console.error('Non-validation error:', error);
            return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
        }
    };
};

module.exports = {
    validateMiddleware,
}