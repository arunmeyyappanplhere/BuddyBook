import defaultImage from "/default_avatar.png";

/**
 * onError handler for contact profile images.
 * Swaps any broken/missing image with the bundled default avatar.
 * The dataset flag guards against an infinite loop if the
 * fallback image itself ever fails to load.
 */
export const handleImageError = (event) => {
  const img = event.currentTarget;
  if (!img || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "true";
  img.src = defaultImage;
};