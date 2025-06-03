import apiClient from './client';

// Get weather rankings for provinces
export const getWeatherRankings = async () => {
  try {
    const response = await apiClient.get('/weather/rankings');
    return response.data;
  } catch (error) {
    console.error('Error fetching weather rankings:', error);
    throw error;
  }
};

// Get tourist attractions by province
export const getTouristAttractionsByProvince = async (provinceId) => {
  try {
    const response = await apiClient.get(`/tourist-attractions/${provinceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tourist attractions:', error);
    throw error;
  }
};

// Export default object with all weather API functions
const weatherAPI = {
  getWeatherRankings,
  getTouristAttractionsByProvince,
};

export default weatherAPI;
