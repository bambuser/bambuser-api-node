'use strict';
const { RateLimitExceeded } = require('./errors');

module.exports.getPaginatedGetter = (agent, endpoint, query) => {
  let q = JSON.parse(JSON.stringify(query || {}));
  let cursor = null;

  const fetch = async () => {
    q.after = cursor;
    let response;
    try {
      response = await agent.get(endpoint).query(q);
    } catch (err) {
      if (err.status === 429) {
        throw new RateLimitExceeded();
      }
      throw err;
    }
    let body = response.body;
    if (!body.results) throw new Error('no body');
    cursor = body.next;
    return body.results;
  };
  return {
    next: () => fetch(),
  }
};

module.exports.handleAPIError = err => {
  if (err.status === 404) {
    throw new ResourceNotFound();
  }
  throw new Error(`API Error: ${err.response.text}`);
};
