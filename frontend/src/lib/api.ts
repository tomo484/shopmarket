import axios from 'axios';
import Cookies from 'js-cookie';

// 環境に応じてベースURLを設定
const getBaseURL = () => {
  // 本番環境
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://shopmarket-backend.onrender.com';
  }
  // 開発環境: 直接バックエンドに接続
  return 'http://localhost:8080';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークンを自動付与）
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
