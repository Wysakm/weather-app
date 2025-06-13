import apiClient from './client';

export const placeTypesAPI = {
  // Get all place types
  getAll: async () => {
    try {
      const response = await apiClient.get('/place-types');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get place type by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/place-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new place type
  create: async (data) => {
    try {
      const response = await apiClient.post('/place-types', {
        type_name: data.name,
        // description: data.description
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update place type
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/place-types/${id}`, {
        type_name: data.name,
        description: data.description
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete place type
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/place-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
