import apiClient from './client';
import { setToken, setUserRole, setUserInfo, removeToken } from '../utils/storage';

export const authAPI = {
  // เข้าสู่ระบบ
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = await response.data.data;

      setToken(token);
      setUserRole(JSON.stringify(user.role));
      setUserInfo(user);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Google OAuth Login
  googleLogin: async (credential) => {
    try {
      const response = await apiClient.post('/auth/google', { credential });
      const { token, user } = response.data.data;

      setToken(token);
      setUserRole(JSON.stringify(user.role));
      setUserInfo(user);
      
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // ออกจากระบบ
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      removeToken();
      window.location.href = '/';
    } catch (error) {
      removeToken();
      window.location.href = '/';
    }
  },

  // ตรวจสอบ token
  verifyToken: async () => {
    try {
      const response = await apiClient.post('/auth/verify');
      return response.data;
    } catch (error) {
      removeToken();
      throw error;
    }
  },

  // สมัครสมาชิก
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phonenumber: userData.phonenumber,
        display_name: userData.display_name,
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // อัปเดตโปรไฟล์
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};