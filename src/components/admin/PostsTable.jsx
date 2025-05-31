import React, { useState, useEffect } from "react";
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
  Skeleton,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PostsTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { isAdmin, user, isAuthenticated } = useAuth();

  // Fetch posts from API
  useEffect(() => {
    console.log(' token:', user, isAuthenticated)

    if (isAuthenticated) return;

    const fetchPosts = async () => {
      setTableLoading(true);
      try {
        const data = (await apiClient.get('/posts/')).data.data || [];
        console.log(' data:', data)
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        message.error('Error fetching posts');
      } finally {
        setTableLoading(false);
      }
    };

    fetchPosts();
  }, [user, isAuthenticated]);

  // สร้างฟังก์ชัน fetchPosts แยกสำหรับใช้ใน handlers อื่นๆ
  const refetchPosts = async () => {
    if (isAuthenticated) return;

    setTableLoading(true);
    try {
      const data = await apiClient.get('/posts/');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Error fetching posts');
    } finally {
      setTableLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  // Filter data based on user role
  const getFilteredPosts = () => {
    let filtered = posts;

    // ถ้าไม่ใช่ admin ให้แสดงเฉพาะโพสต์ของตัวเอง
    if (!isAdmin()) {
      filtered = posts.filter(post => post.id_user === user?.id_user);
    }

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

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

  // Define columns based on user role
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Post Title',
        dataIndex: 'title',
        key: 'title',
        width: isAdmin() ? '35%' : '50%',
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      // {
      //   title: 'Body',
      //   dataIndex: 'body',
      //   key: 'body',
      //   width: '25%',
      //   ellipsis: true,
      //   render: (text) => text?.substring(0, 100) + (text?.length > 100 ? '...' : ''),
      // }
    ];

    // เพิ่มคอลัมน์ Author เฉพาะ admin
    if (isAdmin()) {
      baseColumns.push({
        title: 'Author',
        dataIndex: 'username',
        key: 'username',
        width: '15%',
        sorter: (a, b) => (a.username || '').localeCompare(b.username || ''),
        responsive: ['md'],
      });
    }

    baseColumns.push(
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        responsive: ['sm'],
        render: (status) => (
          <Tag color={getStatusColor(status)}>{status || 'Pending'}</Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: '15%',
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
              onConfirm={() => handleDelete(record.id_post)}
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
      }
    );

    return baseColumns;
  };

  const handleAdd = () => {
    navigate('/addPost');
  };

  const handleEdit = (post) => {
    // ตรวจสอบสิทธิ์ก่อนแก้ไข
    if (!isAdmin() && post.id_user !== user?.id_user) {
      message.error('You can only edit your own posts');
      return;
    }

    setEditingPost(post);
    form.setFieldsValue({
      title: post.title,
      body: post.body,
      status: post.status || 'Pending',
      image: post.image
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id_post) => {
    const post = posts.find(p => p.id_post === id_post);

    if (!isAdmin() && post?.id_user !== user?.id_user) {
      message.error('You can only delete your own posts');
      return;
    }

    try {
      setTableLoading(true);
      await apiClient.delete(`/posts/${id_post}`);
      message.success('Post deleted successfully');
      refetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      message.error('Error deleting post');
    } finally {
      setTableLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      await apiClient.put(`/posts/${editingPost.id_post}`, {
        title: values.title,
        body: values.body,
        status: values.status,
        image: values.image,
        id_place: editingPost.id_place
      });

      message.success('Post updated successfully');
      setIsModalVisible(false);
      form.resetFields();
      refetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      message.error('Error updating post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Get title based on user role
  const getPageTitle = () => {
    return isAdmin() ? 'Posts Manage' : 'My Posts';
  };

  if (!isAuthenticated || tableLoading) return <Skeleton active />;

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
          {getPageTitle()}
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

      {/* แสดงข้อมูลสถิติ */}
      <div style={{ marginBottom: '16px' }}>
        <Typography.Text type="secondary">
          {isAdmin()
            ? `Showing ${filteredPosts.length} of ${posts.length} total posts`
            : `You have ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''}`
          }
        </Typography.Text>
      </div>

      <div style={{ flex: 1 }}>
        <Table
          columns={getColumns()}
          dataSource={filteredPosts}
          loading={tableLoading}
          rowKey="id_post"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          bordered
          size="middle"
          locale={{
            emptyText: isAdmin()
              ? 'No posts found'
              : 'You haven\'t created any posts yet'
          }}
        />
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Post"
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
            name="body"
            label="Post Body"
            rules={[
              { required: true, message: 'Please input post body!' },
              { min: 10, message: 'Post body must be at least 10 characters!' }
            ]}
          >
            <TextArea
              placeholder="Enter post content"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[
              { type: 'url', message: 'Please enter a valid URL!' }
            ]}
          >
            <Input
              placeholder="Enter image URL"
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
              disabled={!isAdmin()} // user ทั่วไปแก้ไข status ไม่ได้
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
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default PostsTable;


