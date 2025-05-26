import React, { useState } from "react";
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Popconfirm, 
  message,
  Typography,
  Select,
  Tag,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;


const PostsTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Thi Lo Su Waterfall, Tak - The Largest and Most Beautiful Waterfall in Asia',
      author: 'travelthai',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'Phu Chi Fa, Chiang Rai - World-Class Sea of Mist Viewpoint',
      author: 'northernguide',
      status: 'Approved',
    },
    {
      id: 3,
      title: 'Koh Lipe, Satun - Paradise of the Andaman Sea',
      author: 'seathai',
      status: 'Pending',
    },
    {
      id: 4,
      title: 'Experience Old Town Atmosphere at Chiang Khan, Loei',
      author: 'isanguide',
      status: 'Approved',
    },
    {
      id: 5,
      title: 'Naka Cave, Bueng Kan - Mysterious Cave in the Forest',
      author: 'esanguide',
      status: 'Rejected',
    },
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  // Filter data based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Post Title',
      dataIndex: 'title',
      key: 'title',
      width: '45%',
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: '20%',
      sorter: (a, b) => a.author.localeCompare(b.author),
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      responsive: ['sm'],
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space 
          size="small" 
          direction={window.innerWidth < 768 ? "vertical" : "horizontal"}
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          <Button
            type="primary"
            icon={<EditOutlined />}
            size={window.innerWidth < 768 ? "small" : "small"}
            onClick={() => handleEdit(record)}
            style={{ 
              fontSize: window.innerWidth < 768 ? '10px' : '12px',
              padding: window.innerWidth < 768 ? '2px 6px' : '4px 8px',
              minWidth: window.innerWidth < 768 ? '40px' : 'auto'
            }}
          >
            {window.innerWidth < 768 ? '' : 'Edit'}
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size={window.innerWidth < 768 ? "small" : "small"}
              style={{ 
                fontSize: window.innerWidth < 768 ? '10px' : '12px',
                padding: window.innerWidth < 768 ? '2px 6px' : '4px 8px',
                minWidth: window.innerWidth < 768 ? '40px' : 'auto'
              }}
            >
              {window.innerWidth < 768 ? '' : 'Delete'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPost(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    form.setFieldsValue(post);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    message.success('Post deleted successfully');
  };

  const handleSubmit = (values) => {
    setLoading(true);
    
    setTimeout(() => {
      if (editingPost) {
        // Update existing post
        setPosts(posts.map(post => 
          post.id === editingPost.id ? { ...post, ...values } : post
        ));
        message.success('Post updated successfully');
      } else {
        // Add new post
        const newPost = {
          id: Math.max(...posts.map(p => p.id)) + 1,
          ...values,
        };
        setPosts([...posts, newPost]);
        message.success('Post added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
        <Title level={2} style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Posts Manage
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
          style={{
            backgroundColor: 'var(--color-primary)', 
            fontWeight: 'bold',
          }}
        >
          Add Post
        </Button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <Input
          placeholder="Search by post title..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
          size="large"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ minWidth: '150px' }}
          size="large"
        >
          {statusOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={filteredPosts}
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
        title={editingPost ? 'Edit Post' : 'Add New Post'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="Post Title"
            rules={[
              { required: true, message: 'Please input post title!' },
              { min: 5, message: 'Post title must be at least 5 characters!' },
              { max: 200, message: 'Post title cannot exceed 200 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter post title"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="author"
            label="Author"
            rules={[
              { required: true, message: 'Please input author!' },
              { min: 2, message: 'Author must be at least 2 characters!' },
              { max: 50, message: 'Author cannot exceed 50 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter author name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: 'Please select status!' }
            ]}
          >
            <Select 
              placeholder="Select status"
              size="large"
            >
              {statusOptions.filter(option => option.value !== 'all').map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
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
                {editingPost ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default PostsTable;


