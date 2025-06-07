import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Space, message, Card, Spin } from 'antd';
import { LockOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/auth';

const { Title, Text } = Typography;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        message.error('Invalid reset link. Please request a new password reset.');
        navigate('/reset-password');
        return;
      }

      try {
        const response = await authAPI.verifyResetToken(token);
        if (response.success && response.valid) {
          setTokenValid(true);
        } else {
          message.error('Reset link has expired or is invalid. Please request a new one.');
          navigate('/reset-password');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        message.error('Reset link has expired or is invalid. Please request a new one.');
        navigate('/reset-password');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authAPI.resetPassword(token, values.newPassword);
      setResetSuccess(true);
      message.success('Password reset successfully!');
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check all required fields');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  if (verifying) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        padding: '20px'
      }}>
        <Card 
          style={{ 
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            textAlign: 'center'
          }}
          bodyStyle={{ padding: '40px 24px' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Spin size="large" />
            <Text style={{ color: '#666', fontSize: '14px' }}>
              Verifying reset link...
            </Text>
          </Space>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        padding: '20px'
      }}>
        <Card 
          style={{ 
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            textAlign: 'center'
          }}
          bodyStyle={{ padding: '40px 24px' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <div>
              <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
                Password Reset Successful!
              </Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                Your password has been successfully reset. You can now sign in with your new password.
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              onClick={handleGoToLogin}
              style={{
                width: '100%',
                borderRadius: '6px',
                background: 'var(--color-secondary)',
                border: 'none'
              }}
            >
              Go to Sign In
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return null; // Will redirect in useEffect
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px'
        }}
        bodyStyle={{ padding: '40px 24px' }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
              Set New Password
            </Title>
            <Text style={{ color: '#666', fontSize: '14px' }}>
              Please enter your new password below.
            </Text>
          </div>

          <Form
            name="resetPasswordForm"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ marginTop: '20px' }}
          >
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password!'
                },
                {
                  min: 8,
                  message: 'Password must be at least 8 characters!'
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])/,
                  message: 'Password must contain uppercase, lowercase, number and special character!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your new password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your new password!'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your new password"
                size="large"
              />
            </Form.Item>

            <div style={{ marginBottom: '16px' }}>
              <Text style={{ color: '#999', fontSize: '12px' }}>
                Password requirements:
              </Text>
              <ul style={{ color: '#999', fontSize: '11px', margin: '4px 0', paddingLeft: '16px' }}>
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character (@#$%^&*!)</li>
              </ul>
            </div>

            <Form.Item style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  background: 'var(--color-secondary)',
                  border: 'none'
                }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />}
              style={{ padding: 0 }}
              onClick={handleBackToLogin}
            >
              Back to Sign In
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
