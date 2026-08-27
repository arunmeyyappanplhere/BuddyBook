/**
 * Validate a user-selected image file before upload.
 * Returns an error message string, or "" when the file is acceptable.
 */
export const MAX_IMAGE_SIZE_MB = 5;

export const validateImageFile = (file) => {
  if (!file) return "";
  if (!file.type.startsWith("image/")) {
    return "Please select a valid image file.";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return "";
};