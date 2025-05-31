import apiClient from './client';

export const uploadAPI = {
  // Upload single image to Google Cloud Storage
  uploadImage: async (file, onProgress = null) => {
    try {
      console.log('🚀 uploadAPI.uploadImage called with file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const formData = new FormData();
      formData.append('image', file);

      console.log('📤 Sending POST request to /upload-image...');
      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('📊 Upload progress:', progress + '%');
          onProgress?.(progress);
        },
      });

      console.log('📥 Upload response received:', {
        status: response.status,
        data: response.data.data,
        headers: response.headers
      });

      const imageUrl = response.data.data.imageUrl || response.data.imageUrl;
      console.log('🖼️ Extracted imageUrl:', imageUrl);

      if (!imageUrl) {
        console.warn('⚠️ No imageUrl found in response');
        return {
          success: false,
          message: 'No image URL returned from server'
        };
      }

      return {
        success: true,
        imageUrl: imageUrl,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      console.error('💥 Upload error:', error);
      console.error('💥 Error response:', error.response?.data);
      console.error('💥 Error status:', error.response?.status);

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Upload failed'
      };
    }
  },

  // Upload multiple images to Google Cloud Storage
  uploadMultipleImages: async (files, onProgress = null) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('images', file);
      });

      const response = await apiClient.post('/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return {
        success: true,
        imageUrls: response.data.imageUrls || response.data.urls,
        message: 'Images uploaded successfully'
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Upload failed'
      };
    }
  },

  // Delete image from Google Cloud Storage
  deleteImage: async (imageUrl) => {
    try {
      await apiClient.delete('/delete-image', {
        data: { imageUrl }
      });

      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Delete failed'
      };
    }
  }
};
