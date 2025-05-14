const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        },
        configure: (webpackConfig) => {
            // Bỏ qua source map cho lucide-react
            webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
                if (rule.oneOf) {
                    rule.oneOf = rule.oneOf.filter(
                        (r) => !r.use || !r.use.some((u) => u.loader && u.loader.includes('source-map-loader'))
                    );
                }
                return rule;
            });

            webpackConfig.resolve.fallback = {
                http: false,
                https: false,
                util: false,
                zlib: false,
                stream: false,
                url: false,
                crypto: false,
                assert: false,
            };
            
            return webpackConfig;
        },
    },
    style: {
        postcss: {
            plugins: [
                // require('@tailwindcss/postcss'),
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
};