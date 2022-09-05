const withPWA = require('next-pwa')({
    dest: 'public'
});

/**
 * @type {import('next').NextConfig}
 * */
module.exports = withPWA({
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    experimental: {
        optimizeFonts: true,
    },
});
