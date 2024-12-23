import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "image.buoncf.jp",
        port: "",
        pathname: "/mybook/**"
      },
    ],
  },
  env: {
    api_url_: "https://buoncf.jp:4000/",
    api_url: "http://localhost:4000/",
    ftp_url: "https://image.buoncf.jp/mybook/image/",
    ftp_url_file: "https://image.buoncf.jp/mybook/file/",

  }
};

export default nextConfig;
