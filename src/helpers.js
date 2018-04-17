const promisifyAWS = service =>
  new Proxy(service, {
    get(target, propKey) {
      return function (...args) {
        return target[propKey].apply(service, args).promise();
      };
    },
  });

module.exports = {
  promisifyAWS,
};
