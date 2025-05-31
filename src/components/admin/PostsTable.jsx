import React, { useState, useEffect, useMemo, useCallback } from "react";
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

// Constants
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

const PAGINATION_CONFIG = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
};

const FORM_RULES = {
  title: [
    { required: true, message: 'Please input post title!' },
    { min: 5, message: 'Post title must be at least 5 characters!' },
    { max: 200, message: 'Post title cannot exceed 200 characters!' }
  ],
  body: [
    { required: true, message: 'Please input post body!' },
    { min: 10, message: 'Post body must be at least 10 characters!' }
  ],
  image: [
    { type: 'url', message: 'Please enter a valid URL!' }
  ],
  status: [
    { required: true, message: 'Please select status!' }
  ]
};

// Utility functions
const getStatusColor = (status) => {
  const statusColors = {
    'Pending': 'orange',
    'Approved': 'green',
    'Rejected': 'red'
  };
  return statusColors[status] || 'default';
};

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

  // Consolidated fetch posts function
  const fetchPosts = useCallback(async () => {
    if (!isAuthenticated) return;

    setTableLoading(true);
    try {
      const response = await apiClient.get('/posts/');
      const data = response.data?.data || [];
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Error fetching posts');
    } finally {
      setTableLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter data based on user role - optimized with useMemo
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Show only user's own posts if not admin
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
  }, [posts, searchText, statusFilter, isAdmin, user?.id_user]);

  // Memoized handlers for better performance
  const handleAdd = useCallback(() => {
    navigate('/addPost');
  }, [navigate]);

  const handleEdit = useCallback((post) => {
    // Check permissions before editing
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
  }, [isAdmin, user?.id_user, form]);

  const handleDelete = useCallback(async (id_post) => {
    const post = posts.find(p => p.id_post === id_post);

    if (!isAdmin() && post?.id_user !== user?.id_user) {
      message.error('You can only delete your own posts');
      return;
    }

    try {
      setTableLoading(true);
      await apiClient.delete(`/posts/${id_post}`);
      message.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      message.error('Error deleting post');
    } finally {
      setTableLoading(false);
    }
  }, [posts, isAdmin, user?.id_user, fetchPosts]);

  // Define columns based on user role - memoized for performance
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title: 'Post Title',
        dataIndex: 'title',
        key: 'title',
        width: isAdmin() ? '35%' : '50%',
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
    ];

    // Add author column only for admin
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
              title="Are you sure you want to delete this post?"
              onConfirm={() => handleDelete(record.id_post)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      }
    );

    return baseColumns;
  }, [isAdmin, handleEdit, handleDelete]);

  const handleSubmit = useCallback(async (values) => {
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
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      message.error('Error updating post');
    } finally {
      setLoading(false);
    }
  }, [editingPost, form, fetchPosts]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  // Get title based on user role - memoized for performance
  const pageTitle = useMemo(() => {
    return isAdmin() ? 'Posts Management' : 'My Posts';
  }, [isAdmin]);

  // Memoized loading state for better performance
  const isLoading = useMemo(() => loading || tableLoading, [loading, tableLoading]);

  // Optimized search handler
  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  if (isLoading) return <Skeleton active />;

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
          {pageTitle}
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
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: '200px' }}
          size="large"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ minWidth: '150px' }}
          size="large"
        >
          {STATUS_OPTIONS.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      {/* Statistics display */}
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
          columns={columns}
          dataSource={filteredPosts}
          loading={tableLoading}
          rowKey="id_post"
          pagination={PAGINATION_CONFIG}
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
            rules={FORM_RULES.title}
          >
            <Input
              placeholder="Enter post title"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="body"
            label="Post Body"
            rules={FORM_RULES.body}
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
            rules={FORM_RULES.image}
          >
            <Input
              placeholder="Enter image URL"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={FORM_RULES.status}
          >
            <Select
              placeholder="Select status"
              size="large"
              disabled={!isAdmin()}
            >
              {STATUS_OPTIONS.filter(option => option.value !== 'all').map(option => (
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


