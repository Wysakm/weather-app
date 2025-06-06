import React, { useState, useMemo, useEffect } from 'react';
import { Upload, message, Progress, Modal, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadAPI } from '../api/upload';

const DebugImageUpload = ({
  value = [],
  onChange,
  maxCount = 1,
  maxSize = 2, // MB
  listType = 'picture-card',
  multiple = false,
  showPreview = true,
  uploadText = 'Upload Image',
  className = '',
  style = {}
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [debugLog, setDebugLog] = useState([]);

  // Add debug logging
  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logEntry = `[${timestamp}] ${message}${data ? ': ' + JSON.stringify(data, null, 2) : ''}`;
    console.log(logEntry);
    setDebugLog(prev => [...prev.slice(-9), logEntry]); // Keep last 10 entries
  };

  // Debug value changes
  useEffect(() => {
    addDebugLog('Value changed', { value, type: typeof value, isArray: Array.isArray(value) });
  }, [value]);

  // Convert URLs to file objects for display
  const fileList = useMemo(() => {
    addDebugLog('Calculating fileList', { value });
    
    if (Array.isArray(value)) {
      const result = value.map((url, index) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: 'done',
        url: url,
        thumbUrl: url
      }));
      addDebugLog('FileList (array)', result);
      return result;
    } else if (value) {
      const result = [{
        uid: '0',
        name: 'image',
        status: 'done',
        url: value,
        thumbUrl: value
      }];
      addDebugLog('FileList (single)', result);
      return result;
    }
    addDebugLog('FileList (empty)');
    return [];
  }, [value]);

  const handlePreview = async (file) => {
    addDebugLog('Preview triggered', { file: file.name });
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const beforeUpload = async (file) => {
    addDebugLog('Before upload', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2)
    });

    // Check file type
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      addDebugLog('Invalid file type', file.type);
      message.error('You can only upload JPG/PNG files!');
      return false;
    }

    // Check file size
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      addDebugLog('File too large', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      message.error(`Image must be smaller than ${maxSize}MB!`);
      return false;
    }

    addDebugLog('File validation passed');

    // Start upload
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadAPI.uploadImage(file, setUploadProgress);
      addDebugLog('Upload result', result);
      
      if (result.success && (result.imageUrl || result.url)) {
        const imageUrl = result.imageUrl || result.url || result.data?.imageUrl || result.data?.url;
        addDebugLog('Upload successful, calling onChange', { imageUrl, multiple, currentValue: value });
        
        if (multiple) {
          const newUrls = [...(Array.isArray(value) ? value : []), imageUrl];
          addDebugLog('Setting new URLs (multiple)', newUrls);
          onChange?.(newUrls);
        } else {
          addDebugLog('Setting new URL (single)', imageUrl);
          onChange?.(imageUrl);
        }
        message.success('Image uploaded successfully!');
      } else {
        addDebugLog('Upload failed', result);
        message.error('Upload failed: ' + (result.message || 'No image URL returned'));
      }
    } catch (error) {
      addDebugLog('Upload error', { message: error.message, response: error.response?.data });
      message.error('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    return false; // Prevent default upload behavior
  };

  const handleRemove = async (file) => {
    const imageUrl = file.url;
    
    addDebugLog('Remove triggered', {
      url: imageUrl,
      multiple: multiple,
      currentValue: value
    });
    
    try {
      // Remove from Google Cloud Storage
      const result = await uploadAPI.deleteImage(imageUrl);
      addDebugLog('Delete result', result);
      
      if (multiple) {
        // For multiple images
        const newUrls = (Array.isArray(value) ? value : []).filter(url => url !== imageUrl);
        addDebugLog('New URLs after removal (multiple)', newUrls);
        onChange?.(newUrls);
      } else {
        // For single image
        addDebugLog('Clearing single image');
        onChange?.('');
      }
      
      message.success('Image removed successfully!');
      return true;
    } catch (error) {
      addDebugLog('Remove error', { message: error.message });
      message.error('Failed to remove image');
      return false;
    }
  };

  return (
    <>
      {/* Debug Panel */}
      <Alert
        message="Debug Mode Active"
        description={
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            <strong>Current State:</strong>
            <div>Value: {JSON.stringify(value)}</div>
            <div>FileList length: {fileList.length}</div>
            <div>Uploading: {uploading ? 'Yes' : 'No'}</div>
            <hr />
            <strong>Debug Log:</strong>
            {debugLog.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {log}
              </div>
            ))}
          </div>
        }
        type="info"
        style={{ marginBottom: 16 }}
      />

      <Upload
        listType={listType}
        fileList={fileList}
        onPreview={showPreview ? handlePreview : undefined}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        showUploadList={true}
        className={className}
        style={style}
        multiple={multiple}
        maxCount={maxCount}
      >
        {fileList.length >= maxCount ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{uploadText}</div>
            {uploading && (
              <Progress 
                percent={uploadProgress} 
                size="small" 
                style={{ marginTop: 4 }}
              />
            )}
          </div>
        )}
      </Upload>
      
      {/* Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default DebugImageUpload;
