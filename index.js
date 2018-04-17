const initKMS = require("./src/modules/kms");
const encryption = require("./src/modules/encryption");
const utils = require("./src/modules/utils");

module.exports = {
  initKMS,
  ...encryption,
  ...utils
};
