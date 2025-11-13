import type { NextConfig } from "next";

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
  webpack: (config) => {
    return config;
  },
  async redirects() {
    return [
      {
        source: "/posts",
        destination: "/posts/page/1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
