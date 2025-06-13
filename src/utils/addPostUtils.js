import { IMAGE_VALIDATION } from '../constants/addPostConstants';

/**
 * Normalize API response data
 */
export const normalizeApiResponse = (response) => {
  if (!response) return [];
  
  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

/**
 * Extract district from Google Places address components
 */
export const extractDistrictFromPlace = (addressComponents) => {
  if (!addressComponents?.length) return '';
  
  const districtTypes = [
    'sublocality_level_1',
    'administrative_area_level_2', 
    'locality',
    'sublocality'
  ];
  
  for (const component of addressComponents) {
    const hasDistrictType = districtTypes.some(type => component.types.includes(type));
    if (hasDistrictType) {
      return component.long_name;
    }
  }
  return '';
};

/**
 * Format places data for select options
 */
export const formatPlacesForSelect = (places) => {
  return places.map(place => {
    let provinceName = '';
    if (typeof place.province === 'object' && place.province !== null) {
      provinceName = place.province.name || place.province.province_name || '';
    } else {
      provinceName = place.province || '';
    }

    const locationString = `${place.name_place} - ${place.district || ''}, ${provinceName}`;

    return {
      value: locationString,
      label: locationString,
      place: place
    };
  });
};

/**
 * Format provinces data for select options
 */
export const formatProvincesForSelect = (provinces) => {
  return provinces.map(province => ({
    value: province.id_province,
    label: province.name,
  }));
};

/**
 * Validate uploaded image file
 */
export const validateImageFile = (file) => {
  // Check filename format (only allow a-z, A-Z, 0-9, -, and _)
  const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validNameRegex.test(fileNameWithoutExt)) {
    return { isValid: false, error: IMAGE_VALIDATION.FILENAME_ERROR };
  }

  const isValidType = IMAGE_VALIDATION.ALLOWED_TYPES.includes(file.type);
  if (!isValidType) {
    return { isValid: false, error: IMAGE_VALIDATION.TYPE_ERROR };
  }
  
  const isValidSize = file.size / 1024 / 1024 < IMAGE_VALIDATION.MAX_SIZE_MB;
  if (!isValidSize) {
    return { isValid: false, error: IMAGE_VALIDATION.SIZE_ERROR };
  }
  
  return { isValid: true };
};

/**
 * Convert file to base64 data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get status color for badge
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'success';
    case 'rejected': return 'error';
    default: return 'warning';
  }
};

/**
 * Get status text for display
 */
export const getStatusText = (status) => {
  switch (status) {
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    default: return 'Pending';
  }
};

/**
 * Validate content from Quill editor
 */
export const validateQuillContent = (content) => {
  if (!content) return false;
  
  const cleanContent = content
    .replace(/<p><br\s*\/?><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .trim();
    
  return !!(cleanContent && cleanContent !== '' && cleanContent !== '<p></p>');
};
