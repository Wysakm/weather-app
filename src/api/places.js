import apiClient from './client';

export const placesAPI = {
  // Get all places
  getAll: async () => {
    try {
      const response = await apiClient.get('/places');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get place by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/places/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new place
  create: async (data) => {
    try {
      const response = await apiClient.post('/places', {
        name_place: data.name_place,
        latitude: data.latitude,
        longitude: data.longitude,
        place_type_id: data.place_type_id
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update place
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/places/${id}`, {
        name_place: data.name_place,
        latitude: data.latitude,
        longitude: data.longitude,
        place_type_id: data.place_type_id
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete place
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/places/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
