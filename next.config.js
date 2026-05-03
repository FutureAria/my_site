const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
