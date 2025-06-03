import apiClient from './client';

export const postsAPI = {
  // Get all posts
  getAll: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get post by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new post
  create: async (data) => {
    try {
      const response = await apiClient.post('/posts', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update post
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/posts/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete post
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get posts by user ID
  getByUserId: async (userId) => {
    try {
      const response = await apiClient.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get posts by place ID
  getByPlaceId: async (placeId) => {
    try {
      const response = await apiClient.get(`/posts/place/${placeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get posts by province ID
  getByProvinceId: async (provinceId, placeType) => {
    try {
      const endpoint = placeType ? `/posts/province/${provinceId}?place_type=${placeType}` : `/posts/province/${provinceId}`;
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
