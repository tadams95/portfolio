const withNextra = require('nextra')({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.js',
  // other existing nextra config...
})

// Adding webpack configuration to resolve Node.js core modules
const nextConfig = {
  // ...existing config...
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        util: require.resolve('util/'),
        fs: false,
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },
};

// Export the combined configuration
module.exports = withNextra(nextConfig);
