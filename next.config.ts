/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['dev.affrev.co'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/shadcn.png',
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow CORS for all API routes
        source: "/api/:path*",
        headers: [
          { 
            key: "Access-Control-Allow-Origin", 
            value: "https://dev.affrev.co" 
          },
          { 
            key: "Access-Control-Allow-Methods", 
            value: "GET,POST,PUT,DELETE,OPTIONS" 
          },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "Content-Type, Authorization" 
          },
          { 
            key: "Access-Control-Allow-Credentials", 
            value: "true" 
          },
        ],
      },
    ];
  },
}

export default nextConfig;
