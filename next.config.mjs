import transpileModules from 'next-transpile-modules'

const withTM = transpileModules(['@space-metaverse-ag/space-ui'])

/**
 * @type {import('next').NextConfig}
 */
export default withTM({
  compiler: {
    styledComponents: true
  },

  swcMinify: true,

  reactStrictMode: true
})
