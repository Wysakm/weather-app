import React from 'react';
import { Form, Input, Button, Typography, Space, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const Login = ({ handleCancel }) => {
  const { login } = useAuth();

  const onFinish = async (values) => {
    console.log('Login values:', values);
    // จำลองการ login สำเร็จ
    const loginSuccess = await login(values)
    if (!loginSuccess) {
      message.error('เข้าสู่ระบบล้มเหลว! กรุณาตรวจสอบข้อมูลของคุณ');
      return;
    }
    handleCancel()
    message.success('เข้าสู่ระบบสำเร็จ!');
    // navigate ไปหน้าอื่น เช่น dashboard
    // navigate('/dashboard');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // ที่นี่คุณสามารถเพิ่มการ integrate กับ Google OAuth
    message.info('กำลังเชื่อมต่อกับ Google...');

    // ตัวอย่างการใช้ Google OAuth
    // window.location.href = 'YOUR_GOOGLE_OAUTH_URL';
  };

  return (
    <div style={{ width: '100%', }}  >
      <Space className='login-container' direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '10px' }}>
            เข้าสู่ระบบ
          </Title>
          <p style={{ color: '#666', fontSize: '14px' }}>
            กรุณาใส่ข้อมูลของคุณเพื่อเข้าสู่ระบบ
          </p>
        </div>

        {/* Google Login Button */}
        <Button
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleGoogleLogin}
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
          เข้าสู่ระบบด้วย Google
        </Button>

        <Divider>
          <span style={{ color: '#999', fontSize: '12px' }}>หรือ</span>
        </Divider>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="อีเมล"
            name="username"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกอีเมล!'
              },
              // {
              //   type: 'email',
              //   message: 'รูปแบบอีเมลไม่ถูกต้อง!'
              // }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="กรอกอีเมลของคุณ"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="รหัสผ่าน"
            name="password"
            rules={[
              {
                required: true,
                message: 'กรุณากรอกรหัสผ่าน!'
              },
              {
                min: 6,
                message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร!'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="กรอกรหัสผ่านของคุณ"
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
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="link" style={{ padding: 0 }}>
            ลืมรหัสผ่าน?
          </Button>
          <br />
          <span style={{ color: '#666' }}>
            ยังไม่มีบัญชี? {' '}
            <Button type="link" style={{ padding: 0 }}>
              สมัครสมาชิก
            </Button>
          </span>
        </div>
      </Space>
    </div>
    // </div>
  );
};

export default Login;