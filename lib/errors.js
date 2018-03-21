class RateLimitExceeded extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, RateLimitExceeded)
  }
}

module.exports = {
  RateLimitExceeded,
};
