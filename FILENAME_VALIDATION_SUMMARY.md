# Filename Validation Implementation Summary

## Overview
The coverImage upload functionality already has comprehensive filename validation implemented that restricts filenames to only contain:
- Letters: `a-z`, `A-Z`
- Numbers: `0-9`
- Hyphens: `-`
- Underscores: `_`

## Implementation Details

### 1. Regex Pattern
```javascript
const validNameRegex = /^[a-zA-Z0-9_-]+$/;
```

### 2. Validation Logic
The filename validation is implemented in multiple locations for consistency:

#### A. Utils Function (`src/utils/addPostUtils.js`)
```javascript
export const validateImageFile = (file) => {
  // Check filename format (only allow a-z, A-Z, 0-9, -, and _)
  const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validNameRegex.test(fileNameWithoutExt)) {
    return { isValid: false, error: IMAGE_VALIDATION.FILENAME_ERROR };
  }
  // ... other validations
}
```

#### B. Constants (`src/constants/addPostConstants.js`)
```javascript
export const IMAGE_VALIDATION = {
  MAX_SIZE_MB: 2,
  ALLOWED_TYPES: ['image/jpeg', 'image/png'],
  TYPE_ERROR: 'You can only upload JPG/PNG file!',
  SIZE_ERROR: 'Image must smaller than 2MB!',
  FILENAME_ERROR: 'Filename can only contain letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_)!'
};
```

#### C. AddPost Component (`src/pages/addPost.jsx`)
```javascript
const uploadProps = useMemo(() => {
  const config = {
    beforeUpload: (file) => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        message.error(validation.error);
        return Upload.LIST_IGNORE;
      }
      // ... rest of upload logic
    }
  };
  return config;
}, []);
```

#### D. ImageUpload Component (`src/components/ImageUpload.jsx`)
```javascript
const beforeUpload = async (file) => {
  // Check filename format (only allow a-z, A-Z, 0-9, -, and _)
  const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  const validNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validNameRegex.test(fileNameWithoutExt)) {
    message.error('Filename can only contain letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_)!');
    return false;
  }
  // ... rest of validation
};
```

## Valid Filename Examples
✅ `my_image` - Uses underscore
✅ `photo-123` - Uses hyphen and numbers
✅ `ImageFile` - Uses mixed case letters
✅ `test_file_123` - Combination of allowed characters
✅ `ABC` - All uppercase
✅ `abc` - All lowercase

## Invalid Filename Examples
❌ `my image` - Contains space
❌ `photo.extra.dots` - Contains dots
❌ `file@email` - Contains special character (@)
❌ `image#tag` - Contains hash symbol
❌ `file$name` - Contains dollar sign
❌ `image%20` - Contains percent sign
❌ `file+name` - Contains plus sign
❌ `image[1]` - Contains brackets
❌ `file(1)` - Contains parentheses
❌ `image*star` - Contains asterisk
❌ `file&name` - Contains ampersand
❌ `image!` - Contains exclamation mark
❌ `file~name` - Contains tilde
❌ `image\`backtick` - Contains backtick
❌ `file;name` - Contains semicolon
❌ `image:name` - Contains colon
❌ `file"name` - Contains quotes
❌ `image'name` - Contains apostrophe
❌ `file<name>` - Contains angle brackets
❌ `image/name` - Contains forward slash
❌ `file\\name` - Contains backslash
❌ `image|name` - Contains pipe
❌ `file?name` - Contains question mark
❌ `imageΩomega` - Contains Unicode characters
❌ `file中文` - Contains non-Latin characters
❌ `fileáccent` - Contains accented characters

## User Experience
- When a user selects a file with an invalid filename, they immediately see the error message
- The file upload is prevented, protecting the application from invalid filenames
- Clear error message explains exactly what characters are allowed
- Validation happens client-side for immediate feedback

## Status
✅ **ALREADY IMPLEMENTED AND WORKING**

The filename validation is fully functional and properly restricts filenames to only contain `a-z`, `A-Z`, `0-9`, `-`, and `_` characters as requested.

## Testing
The validation has been tested with various filename patterns and correctly:
1. Accepts valid filenames (letters, numbers, hyphens, underscores only)
2. Rejects invalid filenames (spaces, special characters, Unicode, etc.)
3. Shows appropriate error messages to users
4. Prevents upload of files with invalid names

## Files Involved
- `src/utils/addPostUtils.js` - Main validation function
- `src/constants/addPostConstants.js` - Error message constants
- `src/pages/addPost.jsx` - Uses validation in upload component
- `src/components/ImageUpload.jsx` - Standalone validation implementation
- `src/components/DebugImageUpload.jsx` - Debug version with validation
