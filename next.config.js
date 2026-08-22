/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/**/*': ['./database/**/*'],
    '/**/*': ['./database/**/*'],
  },
};

module.exports = nextConfig;
