import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_MEDIA_SECRET;

export function decryptMedia(encryptedUrl) {
  if (!encryptedUrl) return encryptedUrl;
  
  // If it's already a valid url (e.g., during development if they haven't re-run the generator)
  if (encryptedUrl.startsWith("http")) return encryptedUrl;
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedUrl, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // Fallback to original string if decryption fails or returns empty
    return decrypted || encryptedUrl;
  } catch (error) {
    console.error("Failed to decrypt media URL", error);
    return encryptedUrl;
  }
}
