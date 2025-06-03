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
        province_id: data.province_id,
        district: data.district,
        // reference: data.reference, // เพิ่ม Google Places reference
        latitude: data.latitude,
        longitude: data.longitude,
        place_type_id: data.place_type_id,
        google_place_id: data.google_place_id
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
  },

  // Check for duplicate places by name, proximity, and Google reference
  checkDuplicate: async (name, latitude, longitude, googleRef = null, threshold = 0.001) => {
    try {
      const response = await apiClient.get(`/places/check-google/${googleRef}`);
      let places = response.data?.data || response.data || [];
      console.log(' places:', places)
      
      // Normalize inputs
      // const normalizedName = name?.toLowerCase().trim();
      // const lat = parseFloat(latitude);
      // const lng = parseFloat(longitude);
      
      // Check for exact name match, places within proximity threshold, or matching Google reference
      // const duplicates = places.filter(place => {
      //   // Skip if place data is incomplete
      //   if (!place.name_place || !place.latitude || !place.longitude) {
      //     return false;
      //   }
        
      //   const placeName = place.name_place.toLowerCase().trim();
      //   const placeLat = parseFloat(place.latitude);
      //   const placeLng = parseFloat(place.longitude);
      //   const placeRef = place.reference;
        
      //   // Check for Google Places reference match (highest priority)
      //   if (googleRef && placeRef && googleRef === placeRef) {
      //     return true;
      //   }
        
      //   // Check for name similarity (exact match)
      //   const nameSimilar = placeName === normalizedName;
        
      //   // Check for proximity (within threshold distance)
      //   const latDiff = Math.abs(placeLat - lat);
      //   const lngDiff = Math.abs(placeLng - lng);
      //   const withinThreshold = latDiff < threshold && lngDiff < threshold;
        
      //   return nameSimilar || withinThreshold;
      // });
      
      return places.exists;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      throw error;
    }
  }
};
