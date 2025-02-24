import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images : {
    remotePatterns : [
    {
      protocol : "https" , 
      hostname : "img.freepik.com"
    }
    ]
  }
};

export default nextConfig;
