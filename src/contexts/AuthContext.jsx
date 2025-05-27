import React, { createContext, useContext, useState, useEffect } from 'react';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google Identity Services
  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById('google-identity-script')) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const login = async (userData) => {
    try {
      console.log('Logging in user:', userData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: userData.username,
        provider: 'email'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (credentialResponse) => {
    try {
      console.log('Google credential response:', credentialResponse);
      
      const decodedToken = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      console.log('Decoded token:', decodedToken);
      
      const googleUser = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        provider: 'google'
      };
      
      setUser(googleUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now(),
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        provider: 'email'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      googleLoaded,
      login,
      loginWithGoogle,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};