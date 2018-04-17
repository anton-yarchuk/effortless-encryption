const aws = require('aws-sdk');

const { promisifyAWS } = require('../helpers');
const { KMS } = require('../constants');
const { encrypt, decrypt } = require('./encryption');
const { stringToBuffer, bufferToString } = require('./utils');

const _getBuffer = input =>
  Buffer.isBuffer(input) ? input : stringToBuffer(input);

/**
 * Initialize KMS instance which can be used later.
 *
 * @param {Object} awsKmsOptions - options for AWS and KMS services
 * @param {string} awsKmsOptions.accessKeyId - AWS Access Key Id
 * @param {string} awsKmsOptions.secretAccessKey - AWS Access Key secret
 * @param {string} awsKmsOptions.region - AWS Region
 * @param {string} awsKmsOptions.KeyId - KMS Master Key Id
 */
function initKMS(awsKmsOptions) {
  aws.config.update(awsKmsOptions);

  const kms = promisifyAWS(new aws.KMS({ apiVersion: KMS.API_VERSION }));
  const key = { KeyId: awsKmsOptions.KeyId };

  /**
   * Generated new Data Encryption Key based on specified KMS Master Key.
   *
   * @returns {Promise<{key: Buffer, encryptedKey: Buffer}>}
   */
  const generateDataKey = async () => {
    const response = await kms.generateDataKey({
      KeySpec: KMS.DEFAULT_ENCRYPTION_SPEC,
      ...key,
    });
    return { key: response.Plaintext, encryptedKey: response.CiphertextBlob };
  };

  /**
   * Encrypts Data Encryption Key based on specified KMS Master Key.
   *
   * @param key {string | Buffer} - Data Encryption Key
   * @returns {Promise<Buffer>}
   */
  const encryptDataKey = async key => {
    const keyBuffer = _getBuffer(key);

    const response = await kms.encrypt({
      ...key,
      Plaintext: keyBuffer,
    });
    return response.CiphertextBlob;
  };

  /**
   * Decrypts Data Encryption Key.
   *
   * @param {string | Buffer} encryptedKey
   * @returns {Promise<Buffer>}
   */
  const decryptDataKey = async encryptedKey => {
    const keyBuffer = _getBuffer(encryptedKey);
    const response = await kms.decrypt({
      CiphertextBlob: keyBuffer,
    });
    return response.Plaintext;
  };

  /**
   * Creates encryption envelope based on specified KMS Master Key.
   *
   * @param {string} data - data to encrypt into an envelope
   * @returns {Promise<[string, string]>} - encrypted envelope
   */
  const createEnvelope = async data => {
    const { key, encryptedKey } = await generateDataKey();

    const encryptedData = encrypt(data, key);
    return [bufferToString(encryptedData), bufferToString(encryptedKey)];
  };

  /**
   * Decrypts data from the encrypted envelope which was encrypted using specified KMS Master Key.
   *
   * @param {[string, string]} envelope
   * @returns {Promise<string>} - decrypted data
   */
  const decryptEnvelope = async envelope => {
    if (!Array.isArray(envelope) || envelope.length !== 2) {
      throw new Error('Invalid encryption envelope');
    }
    const [encryptedData, encryptedKey] = envelope;
    const decryptedKey = await decryptDataKey(encryptedKey);

    return decrypt(encryptedData, decryptedKey);
  };

  /**
   * Updates the envelope content but keeps envelope encryption key.
   *
   * @param {[string, string]} envelope
   * @param updatedData
   * @returns {Promise<[string, string]>} - updated envelope
   */
  const updateEnvelope = async (envelope, updatedData) => {
    if (!Array.isArray(envelope) || envelope.length !== 2) {
      throw new Error('Invalid encryption envelope');
    }
    const [, encryptedKey] = envelope;
    const decryptedKey = await decryptDataKey(encryptedKey);
    const encryptedData = encrypt(updatedData, decryptedKey);

    return [bufferToString(encryptedData), bufferToString(encryptedKey)];
  };

  return {
    generateDataKey,
    encryptDataKey,
    decryptDataKey,
    createEnvelope,
    decryptEnvelope,
    updateEnvelope,
  };
}

module.exports = initKMS;
