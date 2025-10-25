import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export output
  output: "export",
  // GitHub Pages works better with trailing slashes for static sites
  trailingSlash: true,
};

export default nextConfig;
