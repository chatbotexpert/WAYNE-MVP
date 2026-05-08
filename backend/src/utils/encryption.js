const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
// ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

/**
 * Encrypts a plain text string using AES-256-CBC
 * @param {string} text - The plain text string to encrypt
 * @returns {string} - The encrypted string format: iv:encryptedData
 */
const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption Error:', error);
    return text; // Return plain text if encryption fails (fallback)
  }
};

/**
 * Decrypts an encrypted string using AES-256-CBC
 * @param {string} encryptedText - The encrypted string format: iv:encryptedData
 * @returns {string} - The decrypted plain text string
 */
const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== 'string' || !encryptedText.includes(':')) {
    return encryptedText; // If it's not encrypted format, return as is (for backwards compatibility)
  }
  
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedData = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption Error:', error);
    return encryptedText; // Return original if decryption fails
  }
};

module.exports = {
  encrypt,
  decrypt
};
