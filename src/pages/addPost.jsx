import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { placesAPI } from '../api/places';
import { placeTypesAPI } from '../api/placeTypes';
import { postsAPI } from '../api/posts';
import apiClient from '../api/client';
import { uploadAPI } from '../api/upload';
import {
  INITIAL_FORM_DATA,
  VALIDATION_RULES,
  UPLOAD_CONFIG,
  GOOGLE_MAPS_CONFIG,
  BANGKOK_CENTER,
  STATUS_OPTIONS,
  GOOGLE_MAPS_CHECK_INTERVAL,
  MAP_INIT_DELAY
} from '../constants/addPostConstants';
import {
  normalizeApiResponse,
  extractDistrictFromPlace,
  formatPlacesForSelect,
  validateImageFile,
  getStatusColor,
  getStatusText,
  validateQuillContent
} from '../utils/addPostUtils';

const { Title } = Typography;
const { Option } = Select;

const AddPost = () => {
  const [message, contextHolder] = messageCtx.useMessage();

  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID from URL params
  const isEditMode = Boolean(id); // Determine if we're in edit mode
  const { isAdmin } = useAuth();
  const [form] = Form.useForm();
  const [addPlaceForm] = Form.useForm();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [addPlaceLoading, setAddPlaceLoading] = useState(false);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [ggRef, setGgRef] = useState(''); // Google Places reference/place_id
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Extract province from Google Places address components
  const extractProvinceFromPlace = useCallback((addressComponents) => {
    if (!addressComponents?.length) return null;
    
    const provinceTypes = [
      'administrative_area_level_1',
      'locality'
    ];
    
    for (const component of addressComponents) {
      const hasProvinceType = provinceTypes.some(type => component.types.includes(type));
      if (hasProvinceType) {
        // Find matching province from provinces array
        const matchingProvince = provinces.find(province => 
          province.label.toLowerCase().includes(component.long_name.toLowerCase()) ||
          component.long_name.toLowerCase().includes(province.label.toLowerCase())
        );
        return matchingProvince ? matchingProvince.value : null;
      }
    }
    return null;
  }, [provinces]);

  // Fill form fields from Google Places data
  const fillFormFields = useCallback((place) => {
    const district = extractDistrictFromPlace(place.address_components);
    const provinceId = extractProvinceFromPlace(place.address_components);
    setGgRef(place.reference || place.place_id || '');

    addPlaceForm.setFieldsValue({
      name_place: place.name || '',
      district: district,
      province: provinceId,
      latitude: place.geometry ? place.geometry.location.lat() : '',
      longitude: place.geometry ? place.geometry.location.lng() : ''
    });
  }, [addPlaceForm, extractProvinceFromPlace]);

  // Fetch place types from API
  const fetchPlaceTypes = useCallback(async () => {
    try {
      const response = await placeTypesAPI.getAll();
      const data = normalizeApiResponse(response);
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
      const response = await apiClient.get('/provinces');
      const rawProvinces = response.data?.data || [];
      
      // Transform provinces to match the standalone version format
      const provinceOptions = rawProvinces.map(province => ({
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
      const response = await apiClient.get('/places/');
      const places = response.data?.data || response.data || [];
      const formattedPlaces = formatPlacesForSelect(places);
      setAllPlaces(formattedPlaces);
    } catch (error) {
      console.error('Error fetching places:', error);
      message.error('Failed to load places');
      setAllPlaces([]);
    }
  }, [message]);

  // Initialize Google Maps
  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, GOOGLE_MAPS_CONFIG);

    markerRef.current = new window.google.maps.Marker({
      position: BANGKOK_CENTER,
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

  // Load post data when in edit mode
  useEffect(() => {
    const loadPostData = async () => {
      if (isEditMode && id && allPlaces.length > 0) {
        setLoading(true);
        try {
          const response = await postsAPI.getById(id);
          const post = response.data || response;
          console.log('Loaded post data:', post);
          setEditingPost(post);
          
          // Construct location string from place data
          let locationValue = '';
          if (post.place) {
            // Create location string matching the format used in allPlaces
            const placeName = post.place.name_place;
            const district = post.place.district || '';
            const provinceName = post.place.province?.name || '';
            locationValue = `${placeName} - ${district}, ${provinceName}`;
          } else if (post.id_place) {
            // Fallback: find from allPlaces if place object is not included
            const foundPlace = allPlaces.find(place => 
              place.place.id_place === post.id_place || place.place.id === post.id_place
            );
            if (foundPlace) {
              locationValue = foundPlace.label;
            }
          }
          
          // Prepare cover image data for form
          let coverImageData = null;
          if (post.image) {
            coverImageData = {
              uid: '-1',
              name: 'cover.jpg',
              status: 'done',
              url: post.image
            };
          }
          
          // Set form values
          const initialValues = {
            title: post.title,
            location: locationValue,
            status: post.status,
            coverImage: coverImageData ? [coverImageData] : []
          };
          
          form.setFieldsValue(initialValues);
          setFormData(prev => ({
            ...prev,
            content: post.body || post.content || '',
            coverImage: coverImageData,
            ...initialValues
          }));

          // Set content in Quill editor if available (with delay to ensure editor is initialized)
          const contentToSet = post.body || post.content;
          if (contentToSet) {
            const setEditorContent = () => {
              if (quillRef.current) {
                quillRef.current.root.innerHTML = contentToSet;
                updatePreview();
              } else {
                setTimeout(setEditorContent, 100);
              }
            };
            setEditorContent();
          }
        } catch (error) {
          console.error('Error loading post data:', error);
          message.error('Failed to load post data');
          navigate('/posts');
        } finally {
          setLoading(false);
        }
      }
    };

    // Only load post data when allPlaces is populated (to ensure location matching works)
    if (isEditMode && allPlaces.length > 0) {
      loadPostData();
    }
  }, [isEditMode, id, form, message, navigate, updatePreview, allPlaces]);

  const openAddPlaceModal = useCallback(() => {
    setShowAddPlaceModal(true);

    setTimeout(() => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleMaps);
            initMap();
          }
        }, GOOGLE_MAPS_CHECK_INTERVAL);

        setTimeout(() => clearInterval(checkGoogleMaps), 10000);
      }
    }, MAP_INIT_DELAY);
  }, [initMap]);

  const closeAddPlaceModal = useCallback(() => {
    setShowAddPlaceModal(false);
    addPlaceForm.resetFields();
    setGgRef('');

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setCenter(BANGKOK_CENTER);
      mapInstanceRef.current.setZoom(13);
      markerRef.current.setPosition(BANGKOK_CENTER);
    }
  }, [addPlaceForm]);

  const handleAddPlace = async (values) => {
    setAddPlaceLoading(true);
    try {
      // Get province name from provinces array using ID
      let provinceName = values.province;
      if (typeof values.province === 'number' || !isNaN(values.province)) {
        const selectedProvince = provinces.find(p => p.value === values.province);
        provinceName = selectedProvince ? selectedProvince.label : values.province;
      }

      // Check for duplicates
      const duplicates = await placesAPI.checkDuplicate(
        values.name_place,
        values.latitude,
        values.longitude,
        ggRef
      );

      if (duplicates) {
        message.warning({
          content: 'Duplicate place! Please check if this is the place you want to add.',
          duration: 8,
        });
        setAddPlaceLoading(false);
        return;
      }

      // Create new place with consistent data structure like standalone version
      const placeData = {
        name_place: values.name_place,
        province_id: values.province, // Send province ID instead of name
        district: values.district || '',
        google_place_id: ggRef, // Use google_place_id field name
        latitude: values.latitude,
        longitude: values.longitude,
        place_type_id: values.place_type_id
      };

      await placesAPI.create(placeData);

      // Update location field
      const newLocation = `${values.name_place} - ${values.district || ''}, ${provinceName}`;
      setFormData(prev => ({ ...prev, location: newLocation }));
      form.setFieldsValue({ location: newLocation });

      message.success('Place added successfully!');
      fetchAllPlaces();
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
    console.log(' values:', values)
    setLoading(true);
    try {
      // Validate cover image (only required for new posts)
      if (!isEditMode && !formData.coverImage) {
        message.error('Please select a cover image!');
        return;
      }

      // Validate content using utility function
      if (!validateQuillContent(formData.content)) {
        message.error('Please add some content to your post!');
        return;
      }

      // Find selected place
      const selectedPlace = allPlaces.find(place => place.label === values.location);
      if (!selectedPlace) {
        message.error('Please select a valid location from the list!');
        return;
      }

      // Prepare submission data
      const submitData = {
        title: values.title.trim(),
        body: formData.content.trim(),
        status: isEditMode ? (values.status || 'pending') : 'pending',
        // status: isEditMode ? (editingPost?.status || 'pending') : 'pending',
        id_place: selectedPlace.place.id_place || selectedPlace.place.id
      };
        console.log(' submitData:', submitData)

      // Handle image upload if a new image is provided
      if (formData.coverImage) {
        // Check if it's a new file (File object) or existing image (object with url)
        if (formData.coverImage instanceof File) {
          // Upload new image via API
          const uploadData = await uploadAPI.uploadImage(formData.coverImage);
          if (!uploadData.success) {
            message.error('Failed to upload image. Please try again.');
            return;
          }
          submitData.image = uploadData.imageUrl;
          
          // If editing and there was an old image, send the old image URL to delete it
          if (isEditMode && editingPost?.image && editingPost.image !== uploadData.imageUrl) {
            submitData.oldImageUrl = editingPost.image;
            console.log('Old image URL added for deletion:', editingPost.image);
          }
        } else if (formData.coverImage.url) {
          // Keep existing image URL
          submitData.image = formData.coverImage.url;
        }
      } else if (isEditMode && editingPost?.image) {
        // Keep existing image for edit mode if no new image selected
        submitData.image = editingPost.image;
      }

      // Submit post (create or update)
      if (isEditMode) {
        await postsAPI.update(id, submitData);
        
        // If we have an old image URL and it's different from the new one, try to delete it
        if (submitData.oldImageUrl && submitData.oldImageUrl !== submitData.image) {
          try {
            await uploadAPI.deleteImage(submitData.oldImageUrl);
            console.log('Old image deleted successfully:', submitData.oldImageUrl);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
            // Don't fail the whole operation if image deletion fails
          }
        }
        
        message.success('Post updated successfully!');
      } else {
        await postsAPI.create(submitData);
        message.success('Post submitted successfully!');
      }

      // Navigate back to posts list
      navigate('/posts');

    } catch (error) {
      console.error('Error submitting post:', error);

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
      } else {
        message.error(`Failed to ${isEditMode ? 'update' : 'submit'} post. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Memoized upload configuration
  const uploadProps = useMemo(() => ({
    ...UPLOAD_CONFIG,
    beforeUpload: (file) => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        message.error(validation.error);
        return Upload.LIST_IGNORE;
      }

      // Check if replacing an existing image in edit mode
      const isReplacingImage = isEditMode && editingPost?.image && formData.coverImage?.url;
      
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      if (isReplacingImage) {
        message.success(`${file.name} selected. Previous image will be replaced.`);
      } else {
        message.success(`${file.name} selected successfully`);
      }
      
      return false;
    },
    onRemove: () => {
      setFormData(prev => ({ ...prev, coverImage: null }));
      message.info('Image removed');
      return true;
    },
    onChange: (info) => {
      const fileList = info.fileList;
      form.setFieldsValue({ coverImage: fileList });

      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.status === 'done' || file.status === 'uploading' || !file.status) {
          const actualFile = file.originFileObj || file;
          if (actualFile instanceof File) {
            setFormData(prev => ({ ...prev, coverImage: actualFile }));
          } else {
            setFormData(prev => ({ ...prev, coverImage: file }));
          }
        }
      } else {
        setFormData(prev => ({ ...prev, coverImage: null }));
      }
    },
  }), [form, message, isEditMode, editingPost?.image, formData.coverImage?.url]);

  // Memoized handlers
  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
                status={getStatusColor(formData.status)}
                text={getStatusText(formData.status)}
                style={{ fontSize: '16px', fontWeight: 'bold' }}
              />
            </Col>
          </Row>

          <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
            {isEditMode ? 'Edit Post' : 'Create Post'}
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
            initialValues={formData}
            disabled={loading}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={VALIDATION_RULES.title}
            >
              <Input
                placeholder="Enter post title"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={VALIDATION_RULES.location}
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
                  value={formData.location}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, location: value }));
                    form.setFieldsValue({ location: value });
                  }}
                  options={allPlaces}
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
              rules={VALIDATION_RULES.coverImage}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              }}
            >
              <Upload 
                {...uploadProps} 
                fileList={formData.coverImage && formData.coverImage.url ? [formData.coverImage] : 
                         (form.getFieldValue('coverImage') || [])}
              >
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
              <Form.Item label="Status" name={'status'}>
                <Select
                  value={formData.status}
                  onChange={updatePostStatus}
                  style={{ width: '200px' }}
                >
                  {STATUS_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
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
                loading={loading}
              >
                {isEditMode ? 'Update Post' : 'Submit Post'}
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
                rules={VALIDATION_RULES.placeName}
              >
                <Input size="large" placeholder="Enter place name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="place_type_id"
                label="Place Type"
                rules={VALIDATION_RULES.placeType}
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
                rules={VALIDATION_RULES.province}
              >
                <Select
                  showSearch
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={provinces}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="district"
                label="District (Optional)"
                rules={[{ required: false }]}
              >
                <Input size="large" placeholder="Enter district (optional)" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={VALIDATION_RULES.latitude}
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
                rules={VALIDATION_RULES.longitude}
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