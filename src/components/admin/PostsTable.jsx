import React, { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Popconfirm, 
  message,
  Typography,
  Select,
  Tag,
  Spin,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postsAPI } from '../../api/posts';

const { Title } = Typography;
const { Option } = Select;

const PostsTable = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  // Load posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll();
      const postsData = response.data || response;
      
      // Transform API data to match our table structure
      const transformedPosts = postsData.map(post => ({
        id: post.id_post || post.id,
        title: post.title,
        author: post.user?.username || post.author || 'Unknown',
        authorId: post.id_user || post.authorId,
        status: (post.status || 'pending').toLowerCase(),
        content: post.body || post.content,
        image: post.image,
        createdAt: post.created_at || post.createdAt,
        updatedAt: post.updated_at || post.updatedAt,
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Filter data based on user role
  const getFilteredPosts = () => {
    let filtered = posts;

    // ถ้าไม่ใช่ admin ให้แสดงเฉพาะโพสต์ของตัวเอง
    if (!isAdmin()) {
      const currentUserId = user?.id_user || user?.id;
      filtered = posts.filter(post => {
        const postAuthorId = post.authorId;
        return postAuthorId === currentUserId || 
               String(postAuthorId) === String(currentUserId);
      });
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
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
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
        width: isAdmin() ? '45%' : '60%',
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
      }
    ];

    // เพิ่มคอลัมน์ Author เฉพาะ admin
    if (isAdmin()) {
      baseColumns.push({
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
        width: '20%',
        sorter: (a, b) => a.author.localeCompare(b.author),
        responsive: ['md'],
      });
    }

    baseColumns.push(
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '15%',
        responsive: ['sm'],
        render: (status) => (
          <Tag color={getStatusColor(status)}>
            {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
          </Tag>
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
      }
    );

    return baseColumns;
  };

  const handleAdd = () => {
    navigate('/add-post');
  };

  const handleEdit = (post) => {
    // ตรวจสอบสิทธิ์ก่อนแก้ไข
    if (!isAdmin()) {
      const currentUserId = user?.id_user || user?.id;
      const postAuthorId = post.authorId;
      
      if (postAuthorId !== currentUserId && String(postAuthorId) !== String(currentUserId)) {
        message.error('You can only edit your own posts');
        return;
      }
    }

    // Navigate to addPost with the post ID for editing
    navigate(`/edit-post/${post.id}`);
  };

  const handleDelete = async (id) => {
    const post = posts.find(p => p.id === id);
    
    // ตรวจสอบสิทธิ์ก่อนลบ
    if (!isAdmin()) {
      const currentUserId = user?.id_user || user?.id;
      const postAuthorId = post?.authorId;
      
      if (postAuthorId !== currentUserId && String(postAuthorId) !== String(currentUserId)) {
        message.error('You can only delete your own posts');
        return;
      }
    }

    try {
      await postsAPI.delete(id);
      message.success('Post deleted successfully');
      // Refresh posts list
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      message.error('Failed to delete post');
    }
  };

  // Get title based on user role
  const getPageTitle = () => {
    return isAdmin() ? 'Posts Manage' : 'My Posts';
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
          {getPageTitle()}
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPosts}
            size="large"
            loading={loading}
            title="Refresh posts"
          >
            Refresh
          </Button>
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
        </Space>
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
        <Spin spinning={loading} tip="Loading posts...">
          <Table
            columns={getColumns()}
            dataSource={filteredPosts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: false,
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
        </Spin>
      </div>

    </div>
  );
};

export default PostsTable;


