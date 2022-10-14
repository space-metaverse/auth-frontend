/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@space-metaverse-ag/space-ui']);

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        styledComponents: true,
    },
}

module.exports = withTM(nextConfig)

