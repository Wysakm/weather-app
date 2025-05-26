import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Badge,
  Card,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  message,
  Modal
} from 'antd';
import {
  UploadOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;
const { Option } = Select;

const AddPost = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [form] = Form.useForm();
  const [addPlaceForm] = Form.useForm();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    category: '',
    coverImage: null,
    content: '',
    status: 'pending',
    visible: true
  });
  const [previewContent, setPreviewContent] = useState('');
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [addPlaceLoading, setAddPlaceLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  // ฟังก์ชัน fillFormFields สำหรับเติมข้อมูลจาก Google Places
  const fillFormFields = useCallback((place) => {
    const addressComponents = place.address_components || [];
    let district = '', province = '';

    addressComponents.forEach(component => {
      const types = component.types;
      if (types.includes('administrative_area_level_1')) {
        province = component.long_name;
      } else if (types.includes('sublocality_level_1')) {
        district = component.long_name;
      }
    });

    addPlaceForm.setFieldsValue({
      placeName: place.name || '',
      province: province,
      district: district,
      latitude: place.geometry ? place.geometry.location.lat() : '',
      longitude: place.geometry ? place.geometry.location.lng() : ''
    });
  }, [addPlaceForm]);

  // ฟังก์ชัน initMap สำหรับ Google Maps
  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    
    const bangkok = { lat: 13.7563, lng: 100.5018 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: bangkok,
      zoom: 13
    });

    markerRef.current = new window.google.maps.Marker({
      position: bangkok,
      map: mapInstanceRef.current,
      draggable: true
    });

    const input = document.getElementById('placeSearch');
    if (input) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'TH' }
      });

      autocompleteRef.current.bindTo('bounds', mapInstanceRef.current);

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) {
          return;
        }

        if (place.geometry.viewport) {
          mapInstanceRef.current.fitBounds(place.geometry.viewport);
        } else {
          mapInstanceRef.current.setCenter(place.geometry.location);
          mapInstanceRef.current.setZoom(17);
        }

        markerRef.current.setPosition(place.geometry.location);
        fillFormFields(place);
      });
    }

    markerRef.current.addListener('dragend', () => {
      const position = markerRef.current.getPosition();
      addPlaceForm.setFieldsValue({
        latitude: position.lat(),
        longitude: position.lng()
      });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          fillFormFields(results[0]);
        }
      });
    });
  }, [addPlaceForm, fillFormFields]);

  const updatePreview = useCallback(() => {
    if (quillRef.current) {
      let content = quillRef.current.root.innerHTML;
      const phoneRegex = /(\+?\d{1,3}?[-.\s]?(\d{1,4}[-.\s]?){1,4}\d{1,4})/g;
      content = content.replace(phoneRegex, '[Blocked]');
      setPreviewContent(content);
    }
  }, []);

  const initializeQuill = useCallback(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new window.Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your post content...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['image'],
            ['clean']
          ]
        }
      });

      quillRef.current.on('text-change', () => {
        updatePreview();
        setFormData(prev => ({
          ...prev,
          content: quillRef.current.root.innerHTML
        }));
      });

      quillRef.current.enable();
    }
  }, [updatePreview]);

  useEffect(() => {
    const loadQuill = async () => {
      if (window.Quill) {
        initializeQuill();
      } else {
        const link = document.createElement('link');
        link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js';
        script.onload = initializeQuill;
        document.head.appendChild(script);
      }
    };

    loadQuill();

    return () => {
      // Cleanup if needed
    };
  }, [initializeQuill]);

  // ฟังก์ชันค้นหาสถานที่
  const handleLocationSearch = async (value) => {
    if (!value || value.length < 3) return;

    try {
      // Mock data for demonstration
      const mockSuggestions = [
        { value: `${value} - Bangkok, Thailand`, label: `${value} - Bangkok, Thailand` },
        { value: `${value} - Chiang Mai, Thailand`, label: `${value} - Chiang Mai, Thailand` },
        { value: `${value} - Phuket, Thailand`, label: `${value} - Phuket, Thailand` },
      ];
      setLocationOptions(mockSuggestions);
    } catch (error) {
      console.error('Error searching places:', error);
    }
  };

  const handleLocationSelect = (value) => {
    setFormData(prev => ({ ...prev, location: value }));
    form.setFieldsValue({ location: value });
  };

  const openAddPlaceModal = () => {
    setShowAddPlaceModal(true);
    setTimeout(() => {
      if (window.google && window.google.maps) {
        initMap();
      }
    }, 100);
  };

  const closeAddPlaceModal = () => {
    setShowAddPlaceModal(false);
    addPlaceForm.resetFields();
  };

  const handleAddPlace = async (values) => {
    setAddPlaceLoading(true);
    try {
      console.log('New Place Data:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLocation = `${values.placeName} - ${values.district}, ${values.province}`;
      setFormData(prev => ({ ...prev, location: newLocation }));
      form.setFieldsValue({ location: newLocation });
      
      message.success('Place added successfully!');
      closeAddPlaceModal();
    } catch (error) {
      message.error('Failed to add place');
    } finally {
      setAddPlaceLoading(false);
    }
  };

  const handleValuesChange = (changedValues, allValues) => {
    setFormData(prev => ({ ...prev, ...allValues }));
  };

  const updatePostStatus = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = (values) => {
    const submitData = { ...values, content: formData.content };
    console.log('Form submitted:', submitData);
    message.success('Post submitted successfully!');
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        setFormData(prev => ({ ...prev, coverImage: info.file.originFileObj }));
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const getStatusColor = () => {
    switch (formData.status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = () => {
    switch (formData.status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: '24px', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Card
        style={{
          opacity: !formData.visible ? 0.7 : 1,
          position: 'relative',
          width: '80%'
        }}
      >
        {!formData.visible && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold',
            zIndex: 100
          }}>
            Hidden Post
          </div>
        )}

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                type="text"
                size="large"
                style={{
                  color: '#1890ff',
                  fontWeight: 'bold'
                }}
              >
                Back
              </Button>
            </Col>
            <Col>
              <Badge
                status={getStatusColor()}
                text={getStatusText()}
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              />
            </Col>
          </Row>

          <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
            Create Post
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            initialValues={formData}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter post title!' }]}
            >
              <Input
                placeholder="Enter post title"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please enter location!' }]}
            >
              <Input.Group compact style={{ display: 'flex' }}>
                <Select
                  showSearch
                  style={{ flex: 1 }}
                  size="large"
                  placeholder="Search for a place..."
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleLocationSearch}
                  onSelect={handleLocationSelect}
                  notFoundContent="Type to search places"
                  options={locationOptions}
                  value={formData.location}
                />
                <Button
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={openAddPlaceModal}
                  style={{
                    backgroundColor: '#52c41a',
                    borderColor: '#52c41a',
                    color: 'white'
                  }}
                  title="Add New Place"
                >
                  Add Place
                </Button>
              </Input.Group>
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please select a type!' }]}
            >
              <Select
                placeholder="Select a type"
                size="large"
              >
                <Option value="recommend">Recommend</Option>
                <Option value="campstay">Camp Stay</Option>
                <Option value="travel">Travel</Option>
                <Option value="food">Food</Option>
                <Option value="activity">Activity</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category!' }]}
            >
              <Select
                placeholder="Select a category"
                size="large"
              >
                <Option value="restaurant">Restaurant</Option>
                <Option value="park">Park</Option>
                <Option value="museum">Museum</Option>
                <Option value="mall">Mall</Option>
                <Option value="beach">Beach</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Cover Image"
              name="coverImage"
              rules={[{ required: true, message: 'Please upload a cover image!' }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} size="large">
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Content">
              <div
                ref={editorRef}
                style={{
                  minHeight: '200px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px'
                }}
              />
            </Form.Item>

            <Form.Item label="Preview">
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '12px',
                  backgroundColor: '#fafafa',
                  minHeight: '100px'
                }}
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </Form.Item>

            {isAdmin() && (
              <Form.Item label="Status">
                <Select
                  value={formData.status}
                  onChange={updatePostStatus}
                  style={{ width: '200px' }}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Form.Item>
            )}

            <Divider />
            
            <Row justify="center">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                style={{ width: '200px' }}
              >
                Submit Post
              </Button>
            </Row>
          </Form>
        </Space>
      </Card>

      {/* Add Place Modal */}
      <Modal
        title="Add New Place"
        open={showAddPlaceModal}
        onCancel={closeAddPlaceModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={addPlaceForm}
          layout="vertical"
          onFinish={handleAddPlace}
          autoComplete="off"
        >
          <Form.Item label="Search Place on Google Maps">
            <Input
              id="placeSearch"
              placeholder="Search for a place..."
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="placeName"
                label="Place Name"
                rules={[{ required: true, message: 'Please enter place name!' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="placeType"
                label="Place Type"
                rules={[{ required: true, message: 'Please select place type!' }]}
              >
                <Select placeholder="Select Type" size="large">
                  <Option value="Natural Attraction">Natural Attraction</Option>
                  <Option value="Cultural Site">Cultural Site</Option>
                  <Option value="Religious Place">Religious Place</Option>
                  <Option value="Entertainment">Entertainment</Option>
                  <Option value="Shopping">Shopping</Option>
                  <Option value="Restaurant">Restaurant</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="province"
                label="Province"
                rules={[{ required: true, message: 'Please enter province!' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="district"
                label="District"
                rules={[{ required: true, message: 'Please enter district!' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[{ required: true, message: 'Please enter latitude!' }]}
              >
                <Input type="number" step="any" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[{ required: true, message: 'Please enter longitude!' }]}
              >
                <Input type="number" step="any" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Location on Map">
                <div
                  ref={mapRef}
                  style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#f8f8f8',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px'
          }}>
            <Button onClick={closeAddPlaceModal} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addPlaceLoading}
              size="large"
            >
              Save Place
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AddPost;