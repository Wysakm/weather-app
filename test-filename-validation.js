// Test script to verify filename validation regex
const validNameRegex = /^[a-zA-Z0-9_-]+$/;

const testFilenames = [
  // Valid filenames
  'validFile123',
  'test_file',
  'my-image',
  'Image_123',
  'ABC123',
  'file-name_test',
  
  // Invalid filenames
  'file with spaces',
  'file.extra.dots',
  'file@email',
  'file#hash',
  'file$dollar',
  'file%percent',
  'file+plus',
  'file=equals',
  'file[bracket]',
  'file{brace}',
  'file(paren)',
  'file*star',
  'file&amp',
  'file!exclaim',
  'file~tilde',
  'file`backtick',
  'file;semicolon',
  'file:colon',
  'file"quote',
  "file'apostrophe",
  'file<less>',
  'file/slash',
  'file\\backslash',
  'file|pipe',
  'file?question',
  'fileΩomega',
  'file中文',
  'fileáccent',
];

console.log('=== FILENAME VALIDATION TEST ===\n');

console.log('VALID FILENAMES:');
testFilenames.forEach(filename => {
  const isValid = validNameRegex.test(filename);
  if (isValid) {
    console.log(`✅ "${filename}" - VALID`);
  }
});

console.log('\nINVALID FILENAMES:');
testFilenames.forEach(filename => {
  const isValid = validNameRegex.test(filename);
  if (!isValid) {
    console.log(`❌ "${filename}" - INVALID`);
  }
});

console.log('\n=== REGEX PATTERN ===');
console.log('Pattern: /^[a-zA-Z0-9_-]+$/');
console.log('Allows: a-z, A-Z, 0-9, underscore (_), hyphen (-)');
console.log('Must start and end with allowed characters');
console.log('No spaces or special characters allowed');
