import React, { useState, useEffect } from "react";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Space, 
  message,
  Avatar,
  Divider
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";

const { Title, Text } = Typography;

const MyAccount = () => {
  const { user, updateUser, updateUserProfile } = useAuth();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    display_name: '',
    phonenumber: ''
  });

  useEffect(() => {
    // โหลดข้อมูลผู้ใช้จาก context หรือ API
    if (user) {
      console.log('User data from context:', user);
      const userData = {
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        display_name: user.display_name || '',
        phonenumber: user.phonenumber || ''
      };
      console.log('Mapped user data:', userData);
      setUserInfo(userData);
      form.setFieldsValue(userData);
    } else {
      // จำลองข้อมูลผู้ใช้สำหรับทดสอบ
      const mockUserData = {
        username: 'john_doe',
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        display_name: 'John Doe',
        phonenumber: '+66 81-234-5678'
      };
      console.log('Using mock data:', mockUserData);
      setUserInfo(mockUserData);
      form.setFieldsValue(mockUserData);
    }
  }, [user, form]);

  // Update form when userInfo changes
  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      form.setFieldsValue(userInfo);
      console.log('Form updated with userInfo:', userInfo);
    }
  }, [userInfo, form]);

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(userInfo);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      console.log('Form values to save:', values);
      
      // รวมข้อมูลเดิมกับข้อมูลใหม่
      const updatedUserInfo = {
        ...userInfo,
        ...values
      };
      
      console.log('Updated user info:', updatedUserInfo);
      
      // เรียก API เพื่อบันทึกข้อมูลในฐานข้อมูล
      try {
        await updateUserProfile(values);
        console.log('Profile updated in database successfully');
        
        // อัพเดต local state หลังจากบันทึกฐานข้อมูลสำเร็จ
        setUserInfo(updatedUserInfo);
        setIsEditing(false);
        message.success('บันทึกข้อมูลเรียบร้อยแล้ว');
        
      } catch (dbError) {
        console.error('Database update failed:', dbError);
        
        // ถ้าบันทึกฐานข้อมูลไม่สำเร็จ ให้อัพเดตเฉพาะ local state
        setUserInfo(updatedUserInfo);
        setIsEditing(false);
        
        // อัพเดต context ด้วย local updateUser
        if (updateUser) {
          updateUser(updatedUserInfo);
        }
        
        message.warning('บันทึกข้อมูลในเครื่องเรียบร้อยแล้ว แต่ไม่สามารถซิงค์กับเซิร์ฟเวอร์ได้');
      }
      
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('กรุณากรอกข้อมูลให้ครบถ้วน');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div style={{ 
      width: '80%', 
      margin: '0 auto', 
      padding: '24px',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Row justify="center">
        <Col span={24}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px'
            }}
          >
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: '#1890ff',
                  fontSize: '24px',
                  marginBottom: '16px'
                }}
                icon={!userInfo.first_name && !userInfo.last_name ? <UserOutlined /> : null}
              >
                {(userInfo.first_name || userInfo.last_name) && 
                  getInitials(userInfo.first_name, userInfo.last_name)
                }
              </Avatar>
              <Title level={2} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
                ข้อมูลส่วนตัว
              </Title>
              <Text type="secondary">
                จัดการข้อมูลส่วนตัวของบัญชี
              </Text>
            </div>

            <Divider />

            {/* User Information Form */}
            <Form
              form={form}
              layout="vertical"
              size="large"
              initialValues={userInfo}
              key={JSON.stringify(userInfo)}
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="ชื่อผู้ใช้ (Username)"
                    name="username"
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="ชื่อผู้ใช้"
                      disabled={true}
                      style={{
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="อีเมล"
                    name="email"
                  >
                    <Input 
                      prefix={<MailOutlined />}
                      placeholder="อีเมล"
                      disabled={true}
                      style={{
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="ชื่อ"
                    name="first_name"
                    rules={[
                      { required: false },
                      { min: 2, message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="กรอกชื่อ"
                      disabled={!isEditing}
                      style={{
                        backgroundColor: !isEditing ? '#f5f5f5' : 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="นามสกุล"
                    name="last_name"
                    rules={[
                      { required: false },
                      { min: 2, message: 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="กรอกนามสกุล"
                      disabled={!isEditing}
                      style={{
                        backgroundColor: !isEditing ? '#f5f5f5' : 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="ชื่อที่แสดง (Display Name)"
                    name="display_name"
                    rules={[
                      { required: false },
                      { min: 2, message: 'ชื่อที่แสดงต้องมีอย่างน้อย 2 ตัวอักษร' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />}
                      placeholder="กรอกชื่อที่แสดง"
                      disabled={!isEditing}
                      style={{
                        backgroundColor: !isEditing ? '#f5f5f5' : 'white'
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="เบอร์โทรศัพท์"
                    name="phonenumber"
                    rules={[
                      { required: false },
                      { pattern: /^[0-9+\-\s()]+$/, message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' }
                    ]}
                  >
                    <Input 
                      prefix={<PhoneOutlined />}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      disabled={!isEditing}
                      style={{
                        backgroundColor: !isEditing ? '#f5f5f5' : 'white'
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              {/* Action Buttons */}
              <Row justify="center">
                <Col>
                  <Space size="middle">
                    {!isEditing ? (
                      <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        size="large"
                        onClick={handleEdit}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '6px',
                          height: '40px',
                          paddingLeft: '24px',
                          paddingRight: '24px'
                        }}
                      >
                        แก้ไขข้อมูล
                      </Button>
                    ) : (
                      <>
                        <Button 
                          type="primary" 
                          icon={<SaveOutlined />}
                          size="large"
                          loading={loading}
                          onClick={handleSave}
                          style={{
                            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            height: '40px',
                            paddingLeft: '24px',
                            paddingRight: '24px'
                          }}
                        >
                          {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </Button>
                        <Button 
                          icon={<CloseOutlined />}
                          size="large"
                          onClick={handleCancel}
                          disabled={loading}
                          style={{
                            borderRadius: '6px',
                            height: '40px',
                            paddingLeft: '24px',
                            paddingRight: '24px'
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </>
                    )}
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyAccount;