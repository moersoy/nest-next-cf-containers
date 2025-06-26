/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  /**
   * Only in the local development environment (when running `docker-compose up`),
   * we need to proxy requests from the Next.js dev server to the API server.
   * In production, this routing is handled by the main Cloudflare Worker.
   */
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          // The destination is the API container running on port 3000.
          destination:
            process.env.DOCKER_ENV === 'true'
              ? 'http://api:3000/api/:path*'
              : 'http://localhost:3000/api/:path*',
        },
      ];
    }

    return [];
  },
};

export default nextConfig; 