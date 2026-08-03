import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild
    ? {
        assetPrefix: "/tw-issues/",
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
