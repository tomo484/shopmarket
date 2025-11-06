import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 本番環境ではAPIのリライトを無効化（直接APIエンドポイントを呼び出す）
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    // 開発環境のみローカルAPIにプロキシ
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
