import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Popconfirm, 
  message,
  Typography
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';


const { Title } = Typography;

const TypeTable = () => {
  const [types, setTypes] = useState([
    { id: 1, name: 'Sea', description: 'Coastal and beach locations' },
    { id: 2, name: 'Mountain', description: 'Mountain and highland areas' },
    { id: 3, name: 'Waterfall', description: 'Waterfall and cascade locations' },
    { id: 4, name: 'Cave', description: 'Cave and underground attractions' },
    { id: 5, name: 'Temple', description: 'Religious and cultural sites' },
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: 'Type Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this type?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (type) => {
    setEditingType(type);
    form.setFieldsValue(type);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setTypes(prevTypes => prevTypes.filter(type => type.id !== id));
    message.success('Type deleted successfully');
  };

  const handleAdd = () => {
    setEditingType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      if (editingType) {
        // Update existing type
        setTypes(prevTypes => 
          prevTypes.map(type => 
            type.id === editingType.id 
              ? { ...type, ...values }
              : type
          )
        );
        message.success('Type updated successfully');
      } else {
        // Add new type
        const newType = {
          id: Math.max(...types.map(t => t.id)) + 1,
          ...values
        };
        setTypes(prevTypes => [...prevTypes, newType]);
        message.success('Type created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingType(null);
  };

  return (
    <div style={{ padding: '24px', width: '80%',display: 'flex', flexDirection: 'column',  }}>  
      
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Title level={2} style={{ margin: 0,fontSize:'2rem', fontWeight: 'bold' }}>
            Type Manage
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
            style={{
              backgroundColor: 'var(--color-primary)', fontWeight: 'bold',
            }}
          >
            Add Type
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={types}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          bordered
          size="middle"
        />

        <Modal
          title={editingType ? 'Edit Type' : 'Add New Type'}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={500}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Type Name"
              rules={[
                { required: true, message: 'Please input type name!' },
                { min: 2, message: 'Type name must be at least 2 characters!' },
                { max: 50, message: 'Type name cannot exceed 50 characters!' }
              ]}
            >
              <Input 
                placeholder="Enter type name"
                size="large"
              />
            </Form.Item>

           

            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={handleCancel}
                  size="large"
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  {editingType ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
    
    </div>
  );
};

export default TypeTable;