import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUserRole, getUserInfo, removeToken } from '../utils/storage';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          await authAPI.verifyToken();
          setIsAuthenticated(true);
          setUser(getUserInfo());
          setRole(JSON.parse(getUserRole()));
        } catch (error) {
          console.error('Token verification failed:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials).then(response => response.data);

      setIsAuthenticated(true);
      setUser(data.user);
      setRole(data.user.role);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => {
      const newUser = {
        ...prevUser,
        ...updatedUserData
      };
      // อัพเดทข้อมูลใน localStorage
      localStorage.setItem('userInfo', JSON.stringify(newUser));
      console.log('User updated in context:', newUser);
      return newUser;
    });
  };

  const updateUserProfile = async (profileData) => {
    try {
      // เรียก API เพื่อบันทึกข้อมูลในฐานข้อมูล
      const response = await authAPI.updateProfile(profileData);
      
      // อัพเดท context หลังจากบันทึกสำเร็จ
      updateUser(profileData);
      
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(role);
  };

  const isAdmin = () => {
  return role?.role_name.toLowerCase() === 'admin';
};

  const value = {
    isAuthenticated,
    user,
    role,
    loading,
    login,
    logout,
    updateUser,
    updateUserProfile,
    hasRole,
    hasAnyRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};