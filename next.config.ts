import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.19","192.168.1.20", "localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "palmisland.s3.eu-north-1.amazonaws.com",
        pathname: "/rooms/**",
      },
    ],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
