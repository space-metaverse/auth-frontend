/**
 * @type {import('next').NextConfig}
 */
export default {
  compiler: {
    styledComponents: true
  },

  experimental: {
    transpilePackages: [
      '@space-metaverse-ag/space-ui'
    ]
  },

  reactStrictMode: true
}
