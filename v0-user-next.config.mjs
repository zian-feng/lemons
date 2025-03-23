/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure static files are copied to the output directory
  output: 'standalone',
  // Configure webpack to handle audio files
  webpack(config) {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      type: 'asset/resource',
    });
    
    return config;
  }
};

export default nextConfig;

