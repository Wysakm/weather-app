import React, { useEffect, useCallback } from 'react';
import { Form, Input, Button, Typography, Space, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';

const { Title } = Typography;

const Login = ({ handleCancel }) => {
  const { login, loginWithGoogle, googleLoaded } = useAuth();
  const navigate = useNavigate();

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
    if (googleLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
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
    if (!googleLoaded) {
      message.warning('Please wait, Google Sign-In is loading...');
      return;
    }

    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('One-tap sign-in not displayed');
        }
      });
    } else {
      message.error('Google Sign-In is not available, please try again');
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
          Sign in with Google
        </Button>

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
    </div>
  );
};

export default Login;