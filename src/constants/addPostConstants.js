// Constants for AddPost component
export const BANGKOK_CENTER = { lat: 13.7563, lng: 100.5018 };

export const GOOGLE_MAPS_CONFIG = {
  center: BANGKOK_CENTER,
  zoom: 13,
  draggable: false,
  zoomControl: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  panControl: false,
  keyboardShortcuts: false,
  clickableIcons: false,
  gestureHandling: 'none',
  disableDefaultUI: true,
};

export const UPLOAD_CONFIG = {
  name: 'file',
  multiple: false,
  maxCount: 1,
  accept: '.jpg,.jpeg,.png',
  listType: 'picture',
  showUploadList: {
    showPreviewIcon: false,
    showRemoveIcon: true,
    showDownloadIcon: false,
  }
};

export const VALIDATION_RULES = {
  title: [{ required: true, message: 'Please enter post title!' }],
  location: [{ required: true, message: 'Please select a location!' }],
  coverImage: [{ required: true, message: 'Please upload a cover image!' }],
  placeName: [
    { required: true, message: 'Please enter place name!' },
    { min: 2, message: 'Place name must be at least 2 characters!' },
    { max: 100, message: 'Place name cannot exceed 100 characters!' }
  ],
  placeType: [{ required: true, message: 'Please select place type!' }],
  province: [{ required: true, message: 'Please enter province!' }],
  latitude: [
    { required: true, message: 'Please enter latitude!' },
    { type: 'number', min: -90, max: 90, message: 'Latitude must be between -90 and 90!' }
  ],
  longitude: [
    { required: true, message: 'Please enter longitude!' },
    { type: 'number', min: -180, max: 180, message: 'Longitude must be between -180 and 180!' }
  ]
};

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

export const IMAGE_VALIDATION = {
  MAX_SIZE_MB: 2,
  ALLOWED_TYPES: ['image/jpeg', 'image/png'],
  TYPE_ERROR: 'You can only upload JPG/PNG file!',
  SIZE_ERROR: 'Image must smaller than 2MB!',
  FILENAME_ERROR: 'Filename can only contain letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_)!'
};

export const INITIAL_FORM_DATA = {
  title: '',
  location: '',
  content: '',
  status: 'pending',
  visible: true,
  coverImage: null
};

export const GOOGLE_MAPS_CHECK_INTERVAL = 100;
export const MAP_INIT_DELAY = 300;
