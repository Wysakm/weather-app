import React, { useEffect, useCallback, useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Divider, Modal, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';
import { authAPI } from '../api/auth';
import Login from './Login';

const { Title } = Typography;

const Register = ({ handleCancel }) => {
  const { loginWithGoogle, googleLoaded } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const success = await loginWithGoogle(response);
      if (success) {
        message.success('Successfully registered with Google!');
        if (handleCancel) handleCancel();
        else navigate('/');
      } else {
        message.error('Google registration failed');
      }
    } catch (error) {
      console.error('Google register error:', error);
      message.error('An error occurred during registration');
    }
  }, [loginWithGoogle, handleCancel, navigate]);

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
    console.log('Register values:', values);
    
    // Check if passwords match
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    try {
      // Prepare data to match API format
      const requestData = {
        email: values.email,
        password: values.password,
        username: values.username,
        first_name: values.firstName,
        last_name: values.lastName,
        display_name: `${values.firstName} ${values.lastName}`,
        phonenumber: values.phoneNumber
      };

      await authAPI.register(requestData);
      message.success('Registration successful!');
      if (handleCancel) handleCancel();
      else navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('An error occurred. Please try again.');
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  const handleGoogleRegister = () => {
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
      message.error('Google Sign-In is not available. Please try again.');
    }
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '30px' }}>
      <Card 
        style={{ 
          width: '60%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Space className='register-container' direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
              Sign Up
            </Title>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Please fill in your information to create a new account
            </p>
          </div>

          {/* Google Register Button */}
          <Button
            icon={<GoogleOutlined />}
            size="large"
            onClick={handleGoogleRegister}
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
            Sign up with Google
          </Button>

          <Divider>
            <span style={{ color: '#999', fontSize: '12px' }}>or</span>
          </Divider>

          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            scrollToFirstError
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please enter a username!'
                },
                {
                  min: 3,
                  message: 'Username must be at least 3 characters!'
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores!'
                }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
                size="large"
              />
            </Form.Item>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Form.Item
                label="First Name"
                name="firstName"
                style={{ flex: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your first name!'
                  },
                  {
                    min: 2,
                    message: 'First name must be at least 2 characters!'
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your first name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                style={{ flex: 1 }}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your last name!'
                  },
                  {
                    min: 2,
                    message: 'Last name must be at least 2 characters!'
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your last name"
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email!'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email format!'
                }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: 'Please enter your phone number!'
                },
                {
                  pattern: /^[0-9]{9,10}$/,
                  message: 'Phone number must be 9-10 digits!'
                }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter your phone number"
                size="large"
                maxLength={10}
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

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: '30%',
                  borderRadius: '6px',
                  background: 'var(--color-secondary)',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.opacity = '0.8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--color-secondary)';
                  e.target.style.opacity = '1';
                }}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666' }}>
              Already have an account? {' '}
              <Button type="link" style={{ padding: 0 }} onClick={handleLoginClick}>
                Sign In
              </Button>
            </span>
          </div>

          <Modal
            title="Sign In"
            open={isLoginModalOpen}
            onCancel={handleLoginModalClose}
            footer={null}
            width={400}
          >
            <Login handleCancel={() => {
              handleLoginModalClose();
              if (handleCancel) handleCancel();
              else navigate('/');
            }} />
          </Modal>
        </Space>
      </Card>
    </div>
  );
};

export default Register;