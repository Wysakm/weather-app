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
  message 
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AddPlace = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const fillFormFields = useCallback((place) => {
    const addressComponents = place.address_components || [];
    let district = '', province = '';

    // Extract address components
    addressComponents.forEach(component => {
      const types = component.types;
      if (types.includes('administrative_area_level_1')) {
        province = component.long_name;
      } else if (types.includes('sublocality_level_1')) {
        district = component.long_name;
      }
    });

    // Fill form fields
    form.setFieldsValue({
      placeName: place.name || '',
      province: province,
      district: district,
      latitude: place.geometry ? place.geometry.location.lat() : '',
      longitude: place.geometry ? place.geometry.location.lng() : ''
    });
  }, [form]);

  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    
    // Initialize map with Bangkok center
    const bangkok = { lat: 13.7563, lng: 100.5018 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: bangkok,
      zoom: 13
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
  }, [initMap]); // เพิ่ม initMap ใน dependency array

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Form Data:', values);
      message.success('Place added successfully!');
      navigate('/admin/places');
    } catch (error) {
      message.error('Failed to add place');
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
              name="placeName"
              label="Place Name"
              rules={[
                { required: true, message: 'Please enter place name!' }
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="placeType"
              label="Place Type"
              rules={[
                { required: true, message: 'Please select place type!' }
              ]}
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
              rules={[
                { required: true, message: 'Please enter province!' }
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="district"
              label="District"
              rules={[
                { required: true, message: 'Please enter district!' }
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[
                { required: true, message: 'Please enter latitude!' }
              ]}
            >
              <Input type="number" step="any" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[
                { required: true, message: 'Please enter longitude!' }
              ]}
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