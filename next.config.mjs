/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["https://blog.alivenow.in/"], // Add your WordPress domain
  },

  // Enable static optimization
  trailingSlash: true,

  // Compress output
  compress: true,

  // Optimize for static export
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "gsap"],
  },

  // Headers for better SEO and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
export default nextConfig
