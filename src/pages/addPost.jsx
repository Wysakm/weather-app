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
  message as messageCtx,
  Modal,
  InputNumber,
} from 'antd';
import {
  UploadOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { placesAPI } from '../api/places';
import { placeTypesAPI } from '../api/placeTypes';
import { postsAPI } from '../api/posts';
import apiClient from '../api/client';
import { uploadAPI } from '../api/upload';

const { Title } = Typography;
const { Option } = Select;

const AddPost = () => {
  const [message, contextHolder] = messageCtx.useMessage();

  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [form] = Form.useForm();
  const [addPlaceForm] = Form.useForm();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    coverImage: null,
    content: '',
    status: 'pending',
    visible: true
  });
  const [previewContent, setPreviewContent] = useState('');
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [addPlaceLoading, setAddPlaceLoading] = useState(false);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [ggRef, setGgRef] = useState(''); // เพิ่ม state สำหรับ Google Places reference
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  // ฟังก์ชัน fillFormFields สำหรับเติมข้อมูลจาก Google Places
  const fillFormFields = useCallback((place) => {
    const addressComponents = place.address_components || [];
    let district = '';
    setGgRef(place.reference || ''); // เก็บ Google Places reference

    // Extract address components - try multiple district types
    addressComponents.forEach(component => {
      const types = component.types;

      // Try different district types from Google Places
      if (types.includes('sublocality_level_1') ||
        types.includes('administrative_area_level_2') ||
        types.includes('locality') ||
        types.includes('sublocality')) {
        if (!district) { // Only set if not already found
          district = component.long_name;
        }
      }
    });

    // Fill form fields with Google Places data
    addPlaceForm.setFieldsValue({
      name_place: place.name || '',
      district: district, // Auto-fill district from Google Places or leave empty
      latitude: place.geometry ? place.geometry.location.lat() : '',
      longitude: place.geometry ? place.geometry.location.lng() : ''
      // ไม่เติม province - ให้ผู้ใช้เลือกเองจาก dropdown
    });
  }, [addPlaceForm]);

  // Fetch place types from API
  const fetchPlaceTypes = useCallback(async () => {
    try {
      const response = await placeTypesAPI.getAll();
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
  }, [message]);

  // Fetch provinces from API
  const fetchProvinces = useCallback(async () => {
    try {
      const response = (await apiClient.get('/provinces')).data;
      const provinceOptions = response.data.map(province => ({
        value: province.id_province,
        label: province.name,
      }));
      setProvinces(provinceOptions);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      message.error('Failed to load provinces');
      setProvinces([]);
    }
  }, [message]);

  // Fetch all places from API
  const fetchAllPlaces = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3030/api/places/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      const data = await response.json();
      const places = data.data || data || [];

      // Format places for select options
      const formattedPlaces = places.map(place => {
        // Handle province - it might be an object or string
        let provinceName = '';
        if (typeof place.province === 'object' && place.province !== null) {
          provinceName = place.province.name || place.province.province_name || '';
        } else {
          provinceName = place.province || '';
        }

        const locationString = `${place.name_place} - ${place.district || ''}, ${provinceName}`;

        return {
          value: locationString,
          label: locationString,
          place: place
        };
      });

      setAllPlaces(formattedPlaces);
    } catch (error) {
      console.error('Error fetching places:', error);
      setAllPlaces([]);
    }
  }, []);

  // ฟังก์ชัน initMap สำหรับ Google Maps
  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    const bangkok = { lat: 13.7563, lng: 100.5018 };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: bangkok,
      zoom: 13,
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      panControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
      gestureHandling: 'none',
      disableDefaultUI: true,
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

  // Load place types, provinces and places on component mount
  useEffect(() => {
    fetchPlaceTypes();
    fetchProvinces();
    fetchAllPlaces();
  }, [fetchPlaceTypes, fetchProvinces, fetchAllPlaces]);

  const openAddPlaceModal = () => {
    setShowAddPlaceModal(true);

    // Initialize Google Maps after modal opens
    setTimeout(() => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        // Wait for Google Maps to load if not already loaded
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleMaps);
            initMap();
          }
        }, 100);

        // Clear interval after 10 seconds to prevent infinite loop
        setTimeout(() => clearInterval(checkGoogleMaps), 10000);
      }
    }, 300);
  };

  const closeAddPlaceModal = () => {
    setShowAddPlaceModal(false);
    addPlaceForm.resetFields();
    setGgRef(''); // รีเซ็ต Google Places reference

    // Reset map if it exists
    if (mapInstanceRef.current && markerRef.current) {
      const bangkok = { lat: 13.7563, lng: 100.5018 };
      mapInstanceRef.current.setCenter(bangkok);
      mapInstanceRef.current.setZoom(13);
      markerRef.current.setPosition(bangkok);
    }
  };

  const handleAddPlace = async (values) => {
    console.log(' values:', values)
    setAddPlaceLoading(true);
    try {
      // Get province name from provinces array if it's an ID
      let provinceName = values.province;
      if (typeof values.province === 'number' || !isNaN(values.province)) {
        const selectedProvince = provinces.find(p => p.value === values.province);
        provinceName = selectedProvince ? selectedProvince.label : values.province;
      }

      // Check for duplicate places before creating (including Google reference)
      const duplicates = await placesAPI.checkDuplicate(
        values.name_place,
        values.latitude,
        values.longitude,
        ggRef // เพิ่ม Google Places reference ในการตรวจสอบ
      );
      console.log(' duplicates:', duplicates)

      if (duplicates) {
        // const existingPlace = duplicates[0];

        // Check if it's an exact name match or proximity match
        // const isNameMatch = existingPlace.name_place?.toLowerCase().trim() === values.name_place.toLowerCase().trim();
        // const latDiff = Math.abs(parseFloat(existingPlace.latitude) - parseFloat(values.latitude));
        // const lngDiff = Math.abs(parseFloat(existingPlace.longitude) - parseFloat(values.longitude));
        // const isProximityMatch = latDiff < 0.001 && lngDiff < 0.001;

        let duplicateReason = 'Duplicate place';
        // if (isNameMatch && isProximityMatch) {
        //   duplicateReason = 'same name and location';
        // } else if (isNameMatch) {
        //   duplicateReason = 'same name';
        // } else if (isProximityMatch) {
        //   duplicateReason = 'same location';
        // }

        // Use the existing place instead of creating a new one
        // const existingLocation = `${existingPlace.name_place} - ${existingPlace.district || ''}, ${existingPlace.province || provinceName}`;
        // setFormData(prev => ({ ...prev, location: existingLocation }));
        // form.setFieldsValue({ location: existingLocation });

        message.error({
          content: `Place already exists with ${duplicateReason}! Using existing place`,
          duration: 5,
        });
        // closeAddPlaceModal();
        return;
      }

      const _data = {
        name_place: values.name_place,
        province: provinceName,
        district: values.district || '',
        reference: ggRef, // เพิ่ม Google Places reference
        latitude: values.latitude,
        longitude: values.longitude,
        place_type_id: values.place_type_id
      }
      console.log('Creating new place with values:', _data)
      // Create the place using the API if no duplicates found
      await placesAPI.create(_data);

      // Update the location field with the new place
      const newLocation = `${values.name_place} - ${values.district || ''}, ${provinceName}`;
      setFormData(prev => ({ ...prev, location: newLocation }));
      form.setFieldsValue({ location: newLocation });

      message.success('Place added successfully!');
      fetchAllPlaces(); // Refresh places list
      closeAddPlaceModal();
    } catch (error) {
      console.error('Error adding place:', error);
      if (error.response?.status === 401) {
        message.error('Please login to add place');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to add places');
      } else if (error.response?.status === 400) {
        message.error('Invalid data provided');
      } else {
        message.error('Failed to add place');
      }
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

  const handleSubmit = async (values) => {
    try {
      // Validate that cover image is selected
      if (!formData.coverImage) {
        message.error('Please select a cover image!');
        return;
      }

      // Validate that content is not empty or contains only empty HTML
      const cleanContent = formData.content?.replace(/<p><br\s*\/?><\/p>/g, '').replace(/<p><\/p>/g, '').trim();
      if (!formData.content || !cleanContent || cleanContent === '' || cleanContent === '<p></p>') {
        message.error('Please add some content to your post!');
        return;
      }

      // Find the selected place to get its ID
      const selectedPlace = allPlaces.find(place => place.label === values.location);
      console.log('Selected location:', values.location);
      console.log('Available places:', allPlaces.map(p => p.label));
      console.log('Found selected place:', selectedPlace);

      if (!selectedPlace) {
        message.error('Please select a valid location from the list!');
        return;
      }

      // Convert image to base64 data URL
      let imageDataUrl = '';
      if (formData.coverImage) {
        console.log('Converting image to base64:', formData.coverImage);
        const imageFile = formData.coverImage.originFileObj || formData.coverImage;

        if (imageFile instanceof File) {
          try {
            imageDataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(imageFile);
            });
            console.log('Image converted to base64, length:', imageDataUrl.length);
          } catch (error) {
            console.error('Error converting image to base64:', error);
            message.error('Failed to process image. Please try again.');
            return;
          }
        } else {
          console.error('Invalid image file object:', imageFile);
          message.error('Invalid image file. Please select a valid image.');
          return;
        }
      }

      // Create JSON data object matching backend expectations
      const submitData = {
        title: values.title.trim(),
        body: formData.content.trim(),
        status: 'pending', // Always send 'pending' status
        image: imageDataUrl, // Send base64 data URL
        id_place: selectedPlace.place.id_place || selectedPlace.place.id
      };

      console.log('Form submitted with data:', {
        title: submitData.title,
        body: submitData.body ? 'Content provided' : 'No content',
        status: submitData.status,
        id_place: submitData.id_place,
        image: submitData.image ? `Base64 data (${submitData.image.length} chars)` : 'No image'
      });

      const uploadData = await uploadAPI.uploadImage(formData.coverImage, (progress) => {
        console.log('Upload progress:', progress);
      });
      if (!uploadData.success) {
        message.error('Failed to upload image. Please try again.');
        return;
      }
      console.log('Image uploaded successfully:', uploadData.imageUrl);
      submitData.image = uploadData.imageUrl;

      // Submit to API using postsAPI
      const result = await postsAPI.create(submitData);

      message.success('Post submitted successfully!');
      console.log('Post created:', result);

      // Reset form after successful submission
      form.resetFields();
      setFormData({
        title: '',
        location: '',
        content: '',
        status: 'pending',
        visible: true,
        coverImage: null
      });

      // Clear Quill editor content
      if (quillRef.current) {
        quillRef.current.setContents([]);
      }

      // Clear preview
      setPreviewContent('');

      // Optionally navigate to posts list or stay on page
      // navigate('/admin/posts');

    } catch (error) {
      console.error('Error submitting post:', error);
      console.error('Error response data:', error.response?.data);

      // Handle specific error cases
      if (error.response?.status === 401) {
        message.error('Please login to submit a post');
      } else if (error.response?.status === 403) {
        message.error('You do not have permission to create posts');
      } else if (error.response?.status === 400) {
        message.error('Invalid data provided. Please check your input.');
      } else if (error.response?.status === 413) {
        message.error('File size too large. Please choose a smaller image.');
      } else if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Internal server error';
        message.error(`Server error: ${errorMsg}`);
        console.error('Server error details:', error.response?.data);
      } else {
        message.error('Failed to submit post. Please try again.');
      }
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.jpg,.jpeg,.png',
    listType: 'picture',
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }

      // Store the file directly in formData
      setFormData(prev => ({ ...prev, coverImage: file }));
      message.success(`${file.name} selected successfully`);

      // Return false to prevent automatic upload but keep file in list
      return false;
    },
    onRemove: (file) => {
      setFormData(prev => ({ ...prev, coverImage: null }));
      message.info('Image removed');
      return true;
    },
    onChange: (info) => {
      console.log('Upload onChange:', info);
      const fileList = info.fileList;
      console.log(' fileList:', fileList)

      // Update form field with current fileList
      form.setFieldsValue({ coverImage: fileList });

      // Handle file status
      if (fileList.length > 0) {
        const file = fileList[0];
        console.log('File in onChange:', file);
        console.log('OriginFileObj:', file.originFileObj);

        if (file.status === 'done' || file.status === 'uploading' || !file.status) {
          // Ensure we store the actual file object, not the Ant Design wrapper
          const actualFile = file.originFileObj || file;
          if (actualFile instanceof File) {
            setFormData(prev => ({ ...prev, coverImage: actualFile }));
            console.log('Stored file in formData:', actualFile.name);
          } else {
            console.warn('Not a File object:', actualFile);
            setFormData(prev => ({ ...prev, coverImage: file }));
          }
        }
      } else {
        setFormData(prev => ({ ...prev, coverImage: null }));
      }
    },
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
      showDownloadIcon: false,
    }
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
      {contextHolder}
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
              rules={[{ required: true, message: 'Please select a location!' }]}
            >
              <Input.Group compact style={{ display: 'flex' }}>
                <Select
                  showSearch
                  style={{ flex: 1 }}
                  size="large"
                  placeholder="Select a place..."
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, location: value }));
                    form.setFieldsValue({ location: value });
                  }}
                  options={allPlaces}
                  value={formData.location}
                  loading={allPlaces.length === 0}
                  notFoundContent={allPlaces.length === 0 ? "Loading places..." : "No places found"}
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
              label="Cover Image"
              name="coverImage"
              rules={[{ required: true, message: 'Please upload a cover image!' }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                console.log('getValueFromEvent:', e);
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload {...uploadProps} fileList={[]}>
                <Button icon={<UploadOutlined />} size="large" style={{ width: '100%' }}>
                  Click to Upload Cover Image
                </Button>
                <div style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
                  Support: JPG, PNG • Max size: 2MB
                </div>
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
        width={1000}
      >
        <Form
          form={addPlaceForm}
          layout="vertical"
          onFinish={handleAddPlace}
          autoComplete="off"
        >
          {/* Google Places Search */}
          <Form.Item label="Search Place on Google Maps">
            <Input
              id="placeSearch"
              placeholder="Search for a place..."
              size="large"
            />
          </Form.Item>

          <Row gutter={20}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name_place"
                label="Place Name"
                rules={[
                  { required: true, message: 'Please enter place name!' },
                  { min: 2, message: 'Place name must be at least 2 characters!' },
                  { max: 100, message: 'Place name cannot exceed 100 characters!' }
                ]}
              >
                <Input size="large" placeholder="Enter place name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="place_type_id"
                label="Place Type"
                rules={[
                  { required: true, message: 'Please select place type!' }
                ]}
              >
                <Select placeholder="Select place type" size="large">
                  {placeTypes.map(type => (
                    <Option key={type.id_place_type || type.id} value={type.id_place_type || type.id}>
                      {type.type_name || type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="province"
                label="Province"
                rules={[
                  { required: true, message: 'Please enter province!' }
                ]}
              >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={provinces}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="district"
                label="District (Optional)"
                rules={[
                  { required: false }
                ]}
              >
                <Input size="large" placeholder="Enter district (optional)" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[
                  { required: true, message: 'Please enter latitude!' },
                  { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90!' }
                ]}
              >
                <InputNumber
                  placeholder="Enter latitude"
                  size="large"
                  style={{ width: '100%' }}
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[
                  { required: true, message: 'Please enter longitude!' },
                  { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180!' }
                ]}
              >
                <InputNumber
                  placeholder="Enter longitude"
                  size="large"
                  style={{ width: '100%' }}
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Location on Map">
                <div
                  ref={mapRef}
                  style={{
                    width: '100%',
                    height: '400px',
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
            <Button
              onClick={closeAddPlaceModal}
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addPlaceLoading}
              size="large"
              style={{
                backgroundColor: 'var(--color-primary)'
              }}
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