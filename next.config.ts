import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongodb"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/syllabus",
        permanent: false,
      },
      {
        source: "/lectures",
        destination: "/slides",
        permanent: true,
      },
      {
        source: "/lectures/:slug",
        destination: "/slides/:slug",
        permanent: true,
      },
      {
        source: "/project/piazza",
        destination: "/project/pazza",
        permanent: false,
      },
      {
        source: "/slides/tailwind-flex-and-grid",
        destination: "/slides/tailwind-filters-and-grid",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
