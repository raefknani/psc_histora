/**
 * Extracts the room title from the Arabic description if available, 
 * otherwise returns the default title.
 */
export const getRoomTitle = (card) => {
  if (!card.description) return card.title;
  const text = card.description;
  
  // Search for Arabic section first
  const arIndex = text.search(/(?:^|\n)(ar)(?:\r?\n|$)/i);
  if (arIndex !== -1) {
    const arText = text.substring(arIndex);
    const lines = arText.split(/\r?\n/).slice(1);
    for (const line of lines) {
      const trimmed = line.trim();
      // Return first non-empty line
      if (trimmed && !trimmed.toLowerCase().startsWith('overview') && !trimmed.toLowerCase().startsWith('description')) {
        return trimmed.replace(/:$/, '').trim();
      }
    }
  }
  
  return card.title;
};

/**
 * Appends Cloudinary transformation parameters to a URL.
 * @param {string} url - The original Cloudinary URL
 * @param {string} transformations - Transformation string (e.g., 'w_400,c_scale,q_auto,f_auto')
 */
export const getOptimizedImageUrl = (url, transformations = 'q_auto,f_auto') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Find the /upload/ part
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  const part1 = url.substring(0, uploadIndex + 8);
  const part2 = url.substring(uploadIndex + 8);
  
  // We insert our transformation right after /upload/
  return `${part1}${transformations}/${part2}`;
};

/**
 * Preloads an array of image URLs.
 * @param {string[]} urls - Array of image URLs to preload
 */
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve; // Resolve anyway to not block forever
      });
    })
  );
};
