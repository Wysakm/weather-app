import React, { useState } from 'react';
import { Card, Button, Space, Typography, message } from 'antd';
import ImageUpload from './ImageUpload';

const { Title, Text } = Typography;

const ImageUploadTest = () => {
  const [imageValue, setImageValue] = useState('');
  const [uploadCount, setUploadCount] = useState(0);
  const [removeCount, setRemoveCount] = useState(0);

  const handleImageChange = (value) => {
    console.log('🧪 Test: Image value changed:', value);
    setImageValue(value);
    setUploadCount(prev => prev + 1);
  };

  const handleReset = () => {
    setImageValue('');
    setUploadCount(0);
    setRemoveCount(0);
    message.info('Test reset');
  };

  const simulateRemove = () => {
    setImageValue('');
    setRemoveCount(prev => prev + 1);
    message.info('Simulated image removal');
  };

  return (
    <Card title="Image Upload Test Component" style={{ margin: '20px', maxWidth: '600px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Upload Statistics</Title>
          <Text>Upload Events: {uploadCount}</Text><br />
          <Text>Remove Events: {removeCount}</Text><br />
          <Text>Current Value: {imageValue ? 'Has Image' : 'No Image'}</Text>
        </div>

        <ImageUpload
          value={imageValue}
          onChange={handleImageChange}
          maxCount={1}
          uploadText="Test Upload"
        />

        <Space>
          <Button onClick={handleReset}>Reset Test</Button>
          <Button onClick={simulateRemove} disabled={!imageValue}>
            Simulate Remove
          </Button>
        </Space>

        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <Text strong>Debug Info:</Text><br />
          <Text code>Value Type: {typeof imageValue}</Text><br />
          <Text code>Value Length: {imageValue?.length || 0}</Text><br />
          <Text code>Is File: {imageValue instanceof File ? 'Yes' : 'No'}</Text>
        </div>
      </Space>
    </Card>
  );
};

export default ImageUploadTest;
