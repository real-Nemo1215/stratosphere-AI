/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard/findings",
        destination: "/findings",
      },
      {
        source: "/dashboard/connect",
        destination: "/connect",
      },
      {
        source: "/dashboard/history",
        destination: "/history",
      },
      {
        source: "/dashboard/audit",
        destination: "/audit",
      },
      {
        source: "/dashboard/settings",
        destination: "/settings",
      },
    ];
  },
};

export default nextConfig;
