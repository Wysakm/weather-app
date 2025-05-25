import axios from 'axios';
import { getToken, removeToken } from '../utils/storage';
import { message } from 'antd';

// สร้าง axios instance
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - เพิ่ม Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - จัดการ error และ unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token หมดอายุหรือไม่ถูกต้อง
      removeToken();
      message.error('กรุณาเข้าสู่ระบบใหม่');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // ไม่มีสิทธิ์เข้าถึง
      message.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้');
    } else if (error.response?.status >= 500) {
      message.error('เกิดข้อผิดพลาดของเซิร์ฟเวอร์');
    }
    return Promise.reject(error);
  }
);

export default apiClient;