import React, { useState } from 'react';
import { Upload, message, Progress, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadAPI } from '../api/upload';

const ImageUpload = ({
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

  // Convert URLs to file objects for display
  const fileList = Array.isArray(value) ? value.map((url, index) => ({
    uid: `${index}`,
    name: `image-${index}`,
    status: 'done',
    url: url,
    thumbUrl: url
  })) : (value ? [{
    uid: '0',
    name: 'image',
    status: 'done',
    url: value,
    thumbUrl: value
  }] : []);

  const handlePreview = async (file) => {
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
    console.log('🔵 Starting upload for file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2)
    });

    // Check file type
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      console.log('❌ Invalid file type:', file.type);
      message.error('You can only upload JPG/PNG files!');
      return false;
    }

    // Check file size
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      console.log('❌ File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      message.error(`Image must be smaller than ${maxSize}MB!`);
      return false;
    }

    console.log('✅ File validation passed');

    // Start upload
    setUploading(true);
    setUploadProgress(0);

    try {
      console.log('🚀 Calling uploadAPI.uploadImage...');
      const result = await uploadAPI.uploadImage(file, setUploadProgress);
      console.log('📝 Full upload result:', result);
      console.log('📝 Response structure:', {
        success: result.success,
        imageUrl: result.imageUrl,
        url: result.url,
        data: result.data
      });
      
      if (result.success && (result.imageUrl || result.url)) {
        const imageUrl = result.imageUrl || result.url || result.data?.imageUrl || result.data?.url;
        console.log('✅ Upload successful, using imageUrl:', imageUrl);
        
        if (multiple) {
          const newUrls = [...(Array.isArray(value) ? value : []), imageUrl];
          console.log('📸 Setting new URLs (multiple):', newUrls);
          onChange?.(newUrls);
        } else {
          console.log('📸 Setting new URL (single):', imageUrl);
          onChange?.(imageUrl);
        }
        message.success('Image uploaded successfully!');
      } else {
        console.log('❌ Upload failed or no imageUrl:', result);
        message.error('Upload failed: ' + (result.message || 'No image URL returned'));
      }
    } catch (error) {
      console.error('💥 Upload error:', error);
      console.error('💥 Error response:', error.response?.data);
      message.error('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    return false; // Prevent default upload behavior
  };

  const handleRemove = async (file) => {
    const imageUrl = file.url;
    
    try {
      // Remove from Google Cloud Storage
      await uploadAPI.deleteImage(imageUrl);
      
      if (multiple) {
        // For multiple images
        const newUrls = (Array.isArray(value) ? value : []).filter(url => url !== imageUrl);
        onChange?.(newUrls);
      } else {
        // For single image
        onChange?.('');
      }
      
      message.success('Image removed successfully!');
    } catch (error) {
      console.error('Remove error:', error);
      message.error('Failed to remove image');
    }
  };

  return (
    <>
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

export default ImageUpload;
