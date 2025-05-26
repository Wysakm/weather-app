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
  Select
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const PlacesTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');

  // Sample data
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: 'Doi Suthep Temple',
      location: 'Suthep, Mueang',
      type: 'Religious Place',
      province: 'Chiang Mai',
    },
    {
      id: 2,
      name: 'Phi Phi Islands',
      location: 'Ao Nang',
      type: 'Natural Attraction',
      province: 'Krabi',
    },
    {
      id: 3,
      name: 'Grand Palace',
      location: 'Phra Nakhon',
      type: 'Cultural Site',
      province: 'Bangkok',
    },
    {
      id: 4,
      name: 'Night Bazaar',
      location: 'Chang Khlan',
      type: 'Entertainment',
      province: 'Chiang Mai',
    },
    {
      id: 5,
      name: 'Sukhothai Historical Park',
      location: 'Mueang Kao',
      type: 'Cultural Site',
      province: 'Sukhothai',
    },
  ]);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Natural Attraction', label: 'Natural Attraction' },
    { value: 'Cultural Site', label: 'Cultural Site' },
    { value: 'Religious Place', label: 'Religious Place' },
    { value: 'Entertainment', label: 'Entertainment' },
  ];

  const provinceOptions = [
    { value: 'all', label: 'All Provinces' },
    { value: 'Bangkok', label: 'Bangkok' },
    { value: 'Chiang Mai', label: 'Chiang Mai' },
    { value: 'Krabi', label: 'Krabi' },
    { value: 'Sukhothai', label: 'Sukhothai' },
    { value: 'Phuket', label: 'Phuket' },
    { value: 'Ayutthaya', label: 'Ayutthaya' },
  ];

  // Filter data based on search and filters
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || place.type === typeFilter;
    const matchesProvince = provinceFilter === 'all' || place.province === provinceFilter;
    
    return matchesSearch && matchesType && matchesProvince;
  });

  const columns = [
    {
      title: 'Place Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province',
      sorter: (a, b) => a.province.localeCompare(b.province),
    },
    {
      title: 'Actions',
      key: 'actions',
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
            title="Are you sure you want to delete this place?"
            onConfirm={() => handleDelete(record.id)}
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
    },
  ];

  const handleAdd = () => {
    setEditingPlace(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    form.setFieldsValue(place);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setPlaces(places.filter(place => place.id !== id));
    message.success('Place deleted successfully');
  };

  const handleSubmit = (values) => {
    setLoading(true);
    
    setTimeout(() => {
      if (editingPlace) {
        // Update existing place
        setPlaces(places.map(place => 
          place.id === editingPlace.id ? { ...place, ...values } : place
        ));
        message.success('Place updated successfully');
      } else {
        // Add new place
        const newPlace = {
          id: Math.max(...places.map(p => p.id)) + 1,
          ...values
        };
        setPlaces([...places, newPlace]);
        message.success('Place added successfully');
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
      flexDirection: 'column'
    }}>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Title level={2} style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Place Manage
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
          Add Place
        </Button>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <Input
          placeholder="Search by place name..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
          size="large"
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ minWidth: '150px' }}
          size="large"
        >
          {typeOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Select
          value={provinceFilter}
          onChange={setProvinceFilter}
          style={{ minWidth: '150px' }}
          size="large"
        >
          {provinceOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPlaces}
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
        title={editingPlace ? 'Edit Place' : 'Add New Place'}
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
            label="Place Name"
            rules={[
              { required: true, message: 'Please input place name!' },
              { min: 2, message: 'Place name must be at least 2 characters!' },
              { max: 100, message: 'Place name cannot exceed 100 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter place name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: 'Please input location!' },
              { min: 2, message: 'Location must be at least 2 characters!' },
              { max: 100, message: 'Location cannot exceed 100 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter location"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: 'Please select type!' }
            ]}
          >
            <Select 
              placeholder="Select type"
              size="large"
            >
              {typeOptions.filter(option => option.value !== 'all').map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="province"
            label="Province"
            rules={[
              { required: true, message: 'Please input province!' },
              { min: 2, message: 'Province must be at least 2 characters!' },
              { max: 50, message: 'Province cannot exceed 50 characters!' }
            ]}
          >
            <Input 
              placeholder="Enter province"
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
                {editingPlace ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default PlacesTable;


