export interface IAwsKmsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  KeyId: string;
}

export interface IEncryptionEnvelope {
  1: string;
  2: string;
}

export interface IDataKeyPair {
  key: Buffer;
  encryptedKey: Buffer;
}

export interface IKmsInstance {
  generateDataKey(): IDataKeyPair;
  encryptDataKey(key: string | Buffer): Buffer;
  decryptDataKey(encryptedKey: string | Buffer): Buffer;
  createEnvelope(data: string): IEncryptionEnvelope;
  decryptEnvelope(envelope: IEncryptionEnvelope): string;
  updateEnvelope(envelope: IEncryptionEnvelope, updatedData): IEncryptionEnvelope;
}

export interface IEffortlessEncryptionStatic {
  initKMS(config: IAwsKmsConfig): IKmsInstance;

  encrypt(dataText: string, encryptionKey: string | Buffer): string;
  decrypt(encryptedText: string, encryptionKey: string | Buffer): string;

  bufferToString(buffer: Buffer, encoding?: string): string;
  stringToBuffer(string: string, encoding?: string): Buffer;
}

declare const EffortlessEncryption: IEffortlessEncryptionStatic;

export default EffortlessEncryption;
