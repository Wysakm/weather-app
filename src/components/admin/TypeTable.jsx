import React, { useState, useEffect } from 'react';
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
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { placeTypesAPI } from '../../api/placeTypes';


const { Title } = Typography;

const TypeTable = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch types from API
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await placeTypesAPI.getAll();
      // Handle different possible response formats
      let data = response.data;
      if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else {
        data = [];
      }
      
      // Map API response to table format
      const formattedTypes = data.map(type => ({
        id: type.id_place_type || type.id,
        name: type.type_name || type.name,
        description: type.description || `${type.type_name || type.name} locations`
      }));
      setTypes(formattedTypes);
    } catch (error) {
      console.error('Error fetching types:', error);
      if (error.response?.status === 401) {
        message.error('Please login to access this feature');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to access this feature');
      } else {
        message.error('Failed to load place types');
      }
      setTypes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTypes();
  }, []);

  const columns = [
    // {
    //   title: 'No.',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 80,
    //   align: 'center',
    // },
    {
      title: 'Type Name',
      dataIndex: 'name',
      key: 'name',
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    // },
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

  const handleDelete = async (id) => {
    try {
      await placeTypesAPI.delete(id);
      message.success('Type deleted successfully');
      // Refresh the list
      await fetchTypes();
    } catch (error) {
      console.error('Error deleting type:', error);
      if (error.response?.status === 401) {
        message.error('Please login to delete');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to delete');
      } else if (error.response?.status === 404) {
        message.error('Type not found');
      } else {
        message.error('Failed to delete type');
      }
    }
  };

  const handleAdd = () => {
    setEditingType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    
    try {
      if (editingType) {
        // Update existing type
        await placeTypesAPI.update(editingType.id, values);
        message.success('Type updated successfully');
      } else {
        // Add new type
        await placeTypesAPI.create(values);
        message.success('Type created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      // Refresh the list
      await fetchTypes();
    } catch (error) {
      console.error('Error saving type:', error);
      if (error.response?.status === 401) {
        message.error('Please login to save');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to save');
      } else if (error.response?.status === 400) {
        message.error('Invalid data provided');
      } else if (error.response?.status === 409) {
        message.error('Type name already exists');
      } else {
        message.error('Operation failed');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingType(null);
  };

  return (
    <div style={{ 
      padding: '24px', 
      width: '80%',
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>  
      
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Title level={2} style={{ margin: 0,fontSize:'2rem', fontWeight: 'bold' }}>
            Type Manage
          </Title>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchTypes}
              loading={loading}
              size="large"
            >
              Refresh
            </Button>
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
          </Space>
        </div>

        <div style={{ flex: 1 }}>
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
        </div>

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

            {/* <Form.Item
              name="description"
              label="Description"
              rules={[
                { max: 200, message: 'Description cannot exceed 200 characters!' }
              ]}
            >
              <Input.TextArea 
                placeholder="Enter description (optional)"
                size="large"
                rows={3}
              />
            </Form.Item> */}

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
                  loading={submitLoading}
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