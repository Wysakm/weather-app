import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, message, Card } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/auth';
import ResetPasswordForm from './resetPasswordForm';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const token = searchParams.get('token');

  // If token exists in URL, show reset password form
  if (token) {
    return <ResetPasswordForm />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(values.email);
      setEmailSent(true);
      message.success('Password reset email sent successfully!');
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please enter a valid email address');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (emailSent) {
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
            <div>
              <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
                Email Sent!
              </Title>
              <Text style={{ color: '#666', fontSize: '14px' }}>
                We've sent a password reset link to your email address. 
                Please check your inbox and follow the instructions to reset your password.
              </Text>
            </div>
            
            <div style={{ margin: '20px 0' }}>
              <Text style={{ color: '#999', fontSize: '12px' }}>
                Didn't receive the email? Check your spam folder or try again.
              </Text>
            </div>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                onClick={() => setEmailSent(false)}
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  background: 'var(--color-secondary)',
                  border: 'none'
                }}
              >
                Send Another Email
              </Button>
              
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={handleBackToLogin}
                style={{
                  width: '100%',
                  borderRadius: '6px'
                }}
              >
                Back to Sign In
              </Button>
            </Space>
          </Space>
        </Card>
      </div>
    );
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
              Reset Password
            </Title>
            <Text style={{ color: '#666', fontSize: '14px' }}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </div>

          <Form
            name="resetPassword"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ marginTop: '20px' }}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email address!'
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email format!'
                }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>

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
                {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ResetPassword;
