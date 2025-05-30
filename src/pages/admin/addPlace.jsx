import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Typography, 
  Row, 
  Col, 
  message,
  InputNumber
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import apiClient from '../../api/client';
import { placeTypesAPI } from '../../api/placeTypes';
import { placesAPI } from '../../api/places';

const { Title } = Typography;
const { Option } = Select;

const AddPlace = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [placeTypes, setPlaceTypes] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [provinces, setProvinces] = useState([])
  const [ggRef, setGgRef] = useState('')

  useEffect(() => {
    const fetchProvinces = async () => {
      // setProvincesLoading(true);
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
      } finally {
        // setProvincesLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const fillFormFields = useCallback((place) => {
    const addressComponents = place.address_components || [];
    let district = '';
    setGgRef(place.reference);
    
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
    form.setFieldsValue({
      name_place: place.name || '',
      district: district, // Auto-fill district from Google Places or leave empty
      latitude: place.geometry ? place.geometry.location.lat() : '',
      longitude: place.geometry ? place.geometry.location.lng() : ''
    });
  }, [form]);

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

  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    
    // Initialize map with Bangkok center
    const bangkok = { lat: 13.7563, lng: 100.5018 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: bangkok,
      zoom: 13,
      draggable: false,                    // ปิดการลาก
      zoomControl: false,                  // ปิด zoom buttons
      scrollwheel: false,                  // ปิด scroll wheel zoom
      disableDoubleClickZoom: true,        // ปิด double click zoom
      mapTypeControl: false,               // ปิด map type control
      scaleControl: false,                 // ปิด scale control
      streetViewControl: false,            // ปิด street view control
      rotateControl: false,                // ปิด rotate control
      fullscreenControl: false,            // ปิด fullscreen control
      panControl: false,                   // ปิด pan control
      keyboardShortcuts: false,            // ปิด keyboard shortcuts
      clickableIcons: false,               // ปิด clickable icons
      gestureHandling: 'none',             // ปิด gesture handling

      // หรือใช้แบบนี้เพื่อปิดทุกอย่าง
      disableDefaultUI: true,

    });

    // Add marker
    markerRef.current = new window.google.maps.Marker({
      position: bangkok,
      map: mapInstanceRef.current,
      draggable: true
    });

    // Initialize places autocomplete
    const input = document.getElementById('placeSearch');
    if (input) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'TH' }
      });

      // Bind autocomplete to map
      autocompleteRef.current.bindTo('bounds', mapInstanceRef.current);

      // Handle place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) {
          return;
        }

        // Update map view
        if (place.geometry.viewport) {
          mapInstanceRef.current.fitBounds(place.geometry.viewport);
        } else {
          mapInstanceRef.current.setCenter(place.geometry.location);
          mapInstanceRef.current.setZoom(17);
        }

        // Update marker
        markerRef.current.setPosition(place.geometry.location);

        // Fill form fields
        fillFormFields(place);
      });
    }

    // Handle marker drag
    markerRef.current.addListener('dragend', () => {
      const position = markerRef.current.getPosition();
      form.setFieldsValue({
        latitude: position.lat(),
        longitude: position.lng()
      });

      // Reverse geocode
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          fillFormFields(results[0]);
        }
      });
    });
  }, [form, fillFormFields]);

  useEffect(() => {
    fetchPlaceTypes(); // Fetch place types on component mount
    
    if (window.google && window.google.maps) {
      initMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initMap();
        }
      }, 100);
      
      return () => clearInterval(checkGoogleMaps);
    }
  }, [initMap, fetchPlaceTypes]); // เพิ่ม initMap ใน dependency array

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Create the place using the API
      await placesAPI.create({
        name_place: values.name_place,
        province: values.province,
        district: values.district,
        reference: ggRef,
        latitude: values.latitude,
        longitude: values.longitude,
        place_type_id: values.place_type_id
      });
      
      message.success('Place added successfully!');
      navigate('/admin/places');
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
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/places');
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '16px auto',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
    }}>
      <div style={{
        marginBottom: '20px'
      }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          style={{ marginBottom: '16px' }}
        >
          Back
        </Button>
        <Title level={2} style={{ margin: 0, color: '#333' }}>
          Add New Place
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
              {/* <Input size="large" /> */}
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
            style={{
              backgroundColor: 'var(--color-primary)'
            }}
          >
            Save Place
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddPlace;