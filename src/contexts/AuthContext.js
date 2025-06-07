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
  const [googleLoaded, setGoogleLoaded] = useState(false);

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

  // Load Google Sign-In script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait for Google Identity Services to fully initialize
        const checkGoogleReady = () => {
          if (window.google?.accounts?.id) {
            console.log('Google Identity Services loaded successfully');
            setGoogleLoaded(true);
          } else {
            console.log('Waiting for Google Identity Services to initialize...');
            setTimeout(checkGoogleReady, 100);
          }
        };
        checkGoogleReady();
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        setGoogleLoaded(false);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleScript();
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

  const loginWithGoogle = async (response) => {
    try {
      const data = await authAPI.googleLogin(response.credential);

      setIsAuthenticated(true);
      setUser(data.data.user);
      setRole(data.data.user.role);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
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
    googleLoaded,
    login,
    loginWithGoogle,
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