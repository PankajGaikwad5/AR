import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.56", 
    "http://192.168.1.56:3000", 
    "http://192.168.1.56:3001",
    "giant-cloths-raise.loca.lt",
    "https://giant-cloths-raise.loca.lt",
    "spicy-beans-grin.loca.lt",
    "https://spicy-beans-grin.loca.lt"
  ],
};

export default nextConfig;
