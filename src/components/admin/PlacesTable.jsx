import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
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
  InputNumber
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { placesAPI } from '../../api/places';
import { placeTypesAPI } from '../../api/placeTypes';

const { Title } = Typography;
const { Option } = Select;

const PlacesTable = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [places, setPlaces] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);

  // Fetch all places from API
  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const response = await placesAPI.getAll();
      // Handle different possible response formats
      let data = response.data;
      if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response)) {
        data = response;
      } else {
        data = [];
      }
      console.log(' data:', data)

      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
      if (error.response?.status === 401) {
        message.error('Please login to access this feature');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to access this feature');
      } else {
        message.error('Failed to load places');
      }
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch place types from API
  const fetchPlaceTypes = useCallback(async () => {
    try {
      const response = await placeTypesAPI.getAll();
      // Handle different possible response formats
      let data = response.data;
      if (response.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response)) {
        data = response;
      } else {
        data = [];
      }
      setPlaceTypes(data);
    } catch (error) {
      console.error('Error fetching place types:', error);
      message.error('Failed to load place types');
      setPlaceTypes([]);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchPlaces();
    fetchPlaceTypes();
  }, [fetchPlaces, fetchPlaceTypes]);

  // Filter data based on search and filters
  const filteredPlaces = places.filter(place => {
    const placeName = place.name_place || place.name || '';
    const matchesSearch = placeName.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || place.place_type_id === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: 'Place Name',
      dataIndex: 'name_place',
      key: 'name_place',
      sorter: (a, b) => (a.name_place || '').localeCompare(b.name_place || ''),
    },
    {
      title: 'Type',
      dataIndex: 'place_type_id',
      key: 'place_type_id',
      render: (typeId) => {
        const type = placeTypes.find(t => (t.id_place_type || t.id) === typeId);
        return type?.type_name || type?.name || 'Unknown';
      }
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
      key: 'latitude',
      render: (lat) => lat ? parseFloat(lat).toFixed(4) : '-'
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
      key: 'longitude',
      render: (lng) => lng ? parseFloat(lng).toFixed(4) : '-'
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
            onConfirm={() => handleDelete(record.id || record.id_place)}
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
    navigate('/admin/addPlace');
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    form.setFieldsValue({
      name_place: place.name_place,
      latitude: place.latitude,
      longitude: place.longitude,
      place_type_id: place.place_type_id
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await placesAPI.delete(id);
      message.success('Place deleted successfully');
      fetchPlaces(); // Refresh the list
    } catch (error) {
      console.error('Error deleting place:', error);
      if (error.response?.status === 401) {
        message.error('Please login to delete');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to delete');
      } else if (error.response?.status === 404) {
        message.error('Place not found');
      } else {
        message.error('Failed to delete place');
      }
    }
  };

  const handleSubmit = async (values) => {
    if (!editingPlace) return; // Only handle editing now
    
    setLoading(true);
    delete values.latitude
    delete values.longitude
    
    try {
      // Update existing place
      await placesAPI.update(editingPlace.id || editingPlace.id_place, values);
      message.success('Place updated successfully');
      
      setIsModalVisible(false);
      form.resetFields();
      fetchPlaces(); // Refresh the list
    } catch (error) {
      console.error('Error updating place:', error);
      if (error.response?.status === 401) {
        message.error('Please login to update');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to update');
      } else if (error.response?.status === 400) {
        message.error('Invalid data provided');
      } else {
        message.error('Update failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingPlace(null);
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
          Place Manage
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPlaces}
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
              backgroundColor: 'var(--color-primary)', 
              fontWeight: 'bold',
            }}
          >
            Add Place
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
          <Option value="all">All Types</Option>
          {placeTypes.map(type => (
            <Option key={type.id_place_type || type.id} value={type.id_place_type || type.id}>
              {type.type_name || type.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={filteredPlaces}
          loading={loading}
          rowKey={(record) => record.id || record.id_place}
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

      {/* Modal for Edit Only */}
      <Modal
        title="Edit Place"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="name_place"
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
            name="latitude"
            label="Latitude"
            rules={[
              { required: true, message: 'Please input latitude!' },
              // { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90!' }
            ]}
          >
            <InputNumber 
              placeholder="Enter latitude"
              size="large"
              style={{ width: '100%' }}
              step={0.000001}
              precision={6}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[
              { required: true, message: 'Please input longitude!' },
              // { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180!' }
            ]}
          >
            <InputNumber 
              placeholder="Enter longitude"
              size="large"
              style={{ width: '100%' }}
              step={0.000001}
              precision={6}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="place_type_id"
            label="Place Type"
            rules={[
              { required: true, message: 'Please select place type!' }
            ]}
          >
            <Select 
              placeholder="Select place type"
              size="large"
            >
              {placeTypes.map(type => (
                <Option key={type.id_place_type || type.id} value={type.id_place_type || type.id}>
                  {type.type_name || type.name}
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

export default PlacesTable;


