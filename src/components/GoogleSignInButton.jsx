import React, { useEffect, useRef } from 'react';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const { loginWithGoogle, googleLoaded } = useAuth();
  const googleButtonRef = useRef(null);

  const handleGoogleResponse = async (response) => {
    try {
      console.log('Google response received:', response);
      const success = await loginWithGoogle(response);
      if (success) {
        message.success('Google login successful!');
        if (onSuccess) onSuccess();
      } else {
        message.error('Google login failed');
        if (onError) onError();
      }
    } catch (error) {
      console.error('Google login error:', error);
      message.error('An error occurred during login');
      if (onError) onError();
    }
  };

  useEffect(() => {
    const initializeGoogleButton = () => {
      if (googleLoaded && window.google?.accounts?.id && googleButtonRef.current) {
        try {
          console.log('Initializing Google Sign-In button...');
          
          // Initialize Google Sign-In
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false
          });

          // Clear any existing content
          if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = '';
          }

          // Render the official Google button
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 300,
            type: 'standard',
            shape: 'rectangular',
            logo_alignment: 'left',
            text: 'signin_with'
          });

          console.log('Google button rendered successfully');
        } catch (error) {
          console.error('Error rendering Google button:', error);
        }
      } else {
        console.log('Google Sign-In not ready yet:', {
          googleLoaded,
          hasGoogle: !!window.google,
          hasAccounts: !!window.google?.accounts,
          hasId: !!window.google?.accounts?.id,
          hasButtonRef: !!googleButtonRef.current
        });
      }
    };

    // Small delay to ensure everything is ready
    if (googleLoaded) {
      setTimeout(initializeGoogleButton, 100);
    }
  }, [googleLoaded]);

  if (!googleLoaded) {
    return <div>Loading Google Sign-In...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
      <div ref={googleButtonRef}></div>
    </div>
  );
};

export default GoogleSignInButton;
