# effortless-encryption

The encryption module for those who need encryption but do not want to spend time on configurations and details.
Also, it has convenient wrappers for effortless usage of Amazon KMS.

### Installation

```console
$ npm i effortless-encryption
```

### Features

* Encrypt/decrypt string data using key (buffer key or string using)
* `AES 256` encryption by default. Encrypted data will be encoded in `base64`.
* Generate new keys, encrypt and decrypt it using Amazon KMS
* TypeScript friendly

### Usage

#### Encryption / Decryption

```javascript 1.7
const { encrypt, decrypt } = require('effortless-encryption');

const encryptedData = encrypt('my secret data', 'my encryption key'); // You can use string of Buffer key
// encryptedData === 'Jh6ZUYwd03Pin++WSbH7QA=='

const decryptedData = decrypt(encryptedData, 'my encryption key');
// decryptedData === 'my secret data'
```

#### KMS envelope encryption

For using AWS KMS the configuration is required:

```javascript 1.7
const { initKMS } = require('effortless-encryption');

const kmsOptions = {
  accessKeyId: 'aws_access_key_id',
  secretAccessKey: 'aws_secret_access_key',
  region: 'aws_region',
  KeyId: 'my_kms_master_key_id',
};

const kms = initKMS(kmsOptions);
```

Now you can use it for generating new encryption keys, encrypt and decrypt the data:

```javascript 1.8
const { key, encryptedKey } = await kms.generateDataKey();

// You can use `key` for encryption and keep `encryptedKey` in your DB
const encrypted = encrypt('some text', key);

// ...

// Later you can decrypt your encryption key using kms:
const decryptedDataKey = await kms.decryptDataKey(encryptedKey);
const decrypted = decrypt(encrypted, key); // decrypted === 'some text'
```
