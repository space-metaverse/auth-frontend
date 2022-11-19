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

  reactStrictMode: true,
  async redirects() {
    return [ 
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'redirect',
            value: '(?<paramName>.*)'
          },
        ],
        permanent: true,
        destination: '/login?redirect=:paramName'.replaceAll("%3A",':').replaceAll("%2F", "/"),
      }
    ]
  },
}
 
