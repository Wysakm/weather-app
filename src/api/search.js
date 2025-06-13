import apiClient from './client';

export const searchAPI = {
  // Search locations by name, province, or place type
  searchLocations: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams({ query, ...filters });
      const response = await apiClient.get(`/search/locations?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },

  // Search provinces by weather conditions
  searchByWeather: async (weatherFilters = {}) => {
    try {
      const params = new URLSearchParams(weatherFilters);
      const response = await apiClient.get(`/search/weather?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching by weather:', error);
      throw error;
    }
  },

  // Get search suggestions for autocomplete
  getSuggestions: async (query, type = 'all') => {
    try {
      const params = new URLSearchParams({ query, type });
      const response = await apiClient.get(`/search/suggestions?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  },

  // Advanced search combining location and weather
  advancedSearch: async (searchParams) => {
    try {
      const params = new URLSearchParams(searchParams);
      const response = await apiClient.get(`/search/advanced?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }
};

export default searchAPI;
