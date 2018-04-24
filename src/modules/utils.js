const { DEFAULT_BUFFERS_ENCODING } = require('../constants');

/**
 * Converts Buffer to string (base64 encoding by default).
 *
 * @param buffer
 * @param {?string} encoding (optional)
 * @returns {string}
 */
module.exports.bufferToString = (buffer, encoding = DEFAULT_BUFFERS_ENCODING) =>
  buffer.toString(encoding);

/**
 * Converts string (base64 encoding by default) to Buffer.
 *
 * @param string
 * @param encoding
 * @returns {Buffer}
 */
module.exports.stringToBuffer = (string, encoding = DEFAULT_BUFFERS_ENCODING) =>
  Buffer.from(string, encoding);
