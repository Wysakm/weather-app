import apiClient from './client';
import { setToken, setUserRole, setUserInfo, removeToken } from '../utils/storage';

export const authAPI = {
  // เข้าสู่ระบบ
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = await response.data.data;

      setToken(token);
      setUserRole(user.role);
      setUserInfo(user);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ออกจากระบบ
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      removeToken();
      window.location.href = '/login';
    } catch (error) {
      removeToken();
      window.location.href = '/login';
    }
  },

  // ตรวจสอบ token
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      removeToken();
      throw error;
    }
  }
};