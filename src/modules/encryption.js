const crypto = require('crypto');

const {
  ENCRYPTION: {
    DEFAULT_INPUT_ENCODING,
    DEFAULT_OUTPUT_ENCODING,
    DEFAULT_ENCRYPTION_SPEC,
  },
} = require('../constants');

/**
 * Encrypts given text using provided encryption key.
 * Uses AES_256.
 *
 * @param dataText
 * @param encryptionKey
 *
 * @returns {string} encrypted data in base64 encoding.
 */
module.exports.encrypt = (dataText, encryptionKey) => {
  let cipher = crypto.createCipher(DEFAULT_ENCRYPTION_SPEC, encryptionKey);
  let crypted = cipher.update(
    dataText,
    DEFAULT_INPUT_ENCODING,
    DEFAULT_OUTPUT_ENCODING,
  );
  crypted += cipher.final(DEFAULT_OUTPUT_ENCODING);
  return crypted;
};

/**
 * Dectypts encrypted text back to the UTF-8.
 * Uses AES_256.
 *
 * @param encryptedText
 * @param encryptionKey
 *
 * @returns {string} decrypted text in UTF-8.
 */
module.exports.decrypt = (encryptedText, encryptionKey) => {
  let decipher = crypto.createDecipher(DEFAULT_ENCRYPTION_SPEC, encryptionKey);
  let decrypted = decipher.update(
    encryptedText,
    DEFAULT_OUTPUT_ENCODING,
    DEFAULT_INPUT_ENCODING,
  );
  decrypted += decipher.final(DEFAULT_INPUT_ENCODING);
  return decrypted;
};
