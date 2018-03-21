class RateLimitExceeded extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, RateLimitExceeded)
  }
}

class UnsupportedQueryParameter extends Error {
  constructor(key) {
    super(`Unsupported query parameter ${key}`);
    Error.captureStackTrace(this, UnsupportedQueryParameter)
  }
}

module.exports = {
  RateLimitExceeded,
  UnsupportedQueryParameter,
};
