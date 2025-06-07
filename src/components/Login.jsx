import React, { useEffect, useCallback, useRef } from 'react';
import { Form, Input, Button, Typography, Space, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';
import GoogleSignInButton from './GoogleSignInButton';
import GoogleDebugInfo from './GoogleDebugInfo';

const { Title } = Typography;

const Login = ({ handleCancel }) => {
  const { login, loginWithGoogle, googleLoaded } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const success = await loginWithGoogle(response);
      if (success) {
        message.success('Google login successful!');
        if (handleCancel) handleCancel();
      } else {
        message.error('Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      message.error('An error occurred during login');
    }
  }, [loginWithGoogle, handleCancel]);

  useEffect(() => {
    // Initialize Google Sign-In when script is loaded
    if (googleLoaded && window.google?.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false
        });

        // Also render a hidden Google button as backup
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 250,
            type: 'standard',
            shape: 'rectangular',
            logo_alignment: 'left'
          });
        }
      } catch (error) {
        console.error('Google Sign-In initialization error:', error);
      }
    }
  }, [googleLoaded, handleGoogleResponse]);

  const onFinish = async (values) => {
    console.log('Login values:', values);
    const loginSuccess = await login(values);
    if (!loginSuccess) {
      message.error('Login failed! Please check your credentials');
      return;
    }
    if (handleCancel) handleCancel();
    message.success('Login successful!');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  const handleGoogleLogin = () => {
    console.log('Attempting Google Sign-In...', { gg: window.google });
    if (!googleLoaded) {
      message.warning('Please wait, Google Sign-In is loading...');
      return;
    }

    if (!window.google?.accounts) {
      message.error('Google Sign-In is not available. Please refresh the page and try again.');
      return;
    }

    try {
      // First, try the prompt method
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One-tap not available, reason:', notification.getNotDisplayedReason());
          // If prompt fails, try to trigger the hidden button
          if (googleButtonRef.current) {
            const hiddenButton = googleButtonRef.current.querySelector('div[role="button"]');
            if (hiddenButton) {
              hiddenButton.click();
            }
          }
        }
      });
    } catch (error) {
      console.error('Google Sign-In error:', error);
      message.error('Google Sign-In encountered an error. Please try again.');
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
    if (handleCancel) {
      handleCancel();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Space className='login-container' direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
            Sign In
          </Title>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Please enter your credentials to sign in
          </p>
        </div>

        {/* Google Sign-In Button - Primary */}
        {/* <GoogleSignInButton onSuccess={handleCancel} /> */}

        {/* <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <span style={{ color: '#999', fontSize: '12px' }}>
            If the button above doesn't work, try the alternative below:
          </span>
        </div> */}

        {/* Alternative: Custom Google Sign-In Button */}
        <Button
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleGoogleLogin}
          loading={!googleLoaded}
          style={{
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            background: '#fff',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          Alternative Google Sign-In
        </Button>

        {/* Hidden Google Button for fallback */}
        <div ref={googleButtonRef} style={{ display: 'none' }}></div>

        <Divider>
          <span style={{ color: '#999', fontSize: '12px' }}>or</span>
        </Divider>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please enter your email!'
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!'
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters!'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                width: '100%',
                borderRadius: '6px',
                background: 'var(--color-secondary)',
                border: 'none'
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="link" style={{ padding: 0 }}>
            Forgot password?
          </Button>
          <br />
          <span style={{ color: '#666' }}>
            Don't have an account? {' '}
            <Button type="link" style={{ padding: 0 }} onClick={handleRegisterClick}>
              Sign up
            </Button>
          </span>
        </div>
      </Space>

      {/* Debug Information - Remove in production */}
      <GoogleDebugInfo />
    </div>
  );
};

export default Login;