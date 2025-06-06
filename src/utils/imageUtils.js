/**
 * Utility functions for handling default images based on post types
 */

export const getDefaultImageByType = (type) => {
  switch (type?.toLowerCase()) {
    case 'camp':
    case 'camping':
      return './image/camp.webp';
    case 'stay':
    case 'accommodation':
    case 'hotel':
    case 'resort':
      return './image/stay.webp';
    default:
      return './image/province.webp'; // Default for other types
  }
};

/**
 * Handle image load error by setting default image based on type
 * @param {Event} event - The error event
 * @param {string} type - The post type
 */
export const handleImageError = (event, type) => {
  const defaultImage = getDefaultImageByType(type);
  if (event.target.src !== defaultImage) {
    event.target.src = defaultImage;
  }
};

/**
 * Get image source with fallback
 * @param {string} imgUrl - Original image URL
 * @param {string} type - Post type for default image selection
 * @returns {string} Image URL or default image
 */
export const getImageWithFallback = (imgUrl, type) => {
  return imgUrl || getDefaultImageByType(type);
};
