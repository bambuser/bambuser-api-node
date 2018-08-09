'use strict';
const superagent = require('superagent');
const crypto = require('crypto');
const queryString = require('query-string');
const {
  getPaginatedGetter,
  handleAPIError,
} = require('./utils');
const {
  ResourceNotFound,
  UnsupportedQueryParameter
} = require('./errors');

const acceptedQueryParameters = [
  'after',
  'byAuthors',
  'createdAfter',
  'createdBefore',
  'hasAllTags',
  'hasAnyTags',
  'limit',
  'titleContains',
];

const validateQueryParameters = query => {
  if (typeof query !== 'object') throw new UnsupportedQueryParameter();
  Object.keys(query).forEach(key => {
    if (!acceptedQueryParameters.includes(key)) {
      throw new UnsupportedQueryParameter(key);
    }
  });
};

class BambuserAPI {
  constructor(config) {
    if (typeof config === 'string') config = {apiKey: config};
    this.config = Object.assign({
      apiUrl: 'https://api.irisplatform.io',
      apiKey: null,
      playerBaseUrl: 'https://dist.bambuser.net/player/',
      daId: null,
      daSecret: null,
    }, config || {});

    if (!this.config.apiKey) {
      throw new Error('Missing api key. Get one at https://irisplatform.io');
    }

    if (this.config.daId && !this.config.daSecret) {
      throw new Error('Missing second half of signing keys (daSecret).');
    }

    if (!this.config.daId && this.config.daSecret) {
      throw new Error('Missing second half of signing keys (daId).');
    }
  }

  get agent() {
    if (this._agent) return this._agent;

    // Construct middleware that adds authentication headers
    const authMW = request => {
      request.url = this.config.apiUrl + request.url;
      request.set('Accept', 'application/vnd.bambuser.v1+json')
      request.set('Authorization', 'Bearer ' + this.config.apiKey)
      if (request.method !== 'DELETE') {
        request.set('Content-Type', 'application/json');
      }
      return request;
    };

    this._agent = superagent.agent().use(authMW);
    return this._agent;
  }

  get broadcasts() {
    return {
      get: (query = {}, options = {}) => {
        validateQueryParameters(query);
        let getter = getPaginatedGetter(this.agent, '/broadcasts', query);
        if (options.withPagination) return getter;
        return getter.next();
      },
      getById: async broadcastId => {
        let response;
        try {
          response = await this.agent.get(`/broadcasts/${broadcastId}`);
        } catch (err) {
          handleAPIError(err);
        }
        return response.body;
      },
      deleteById: async broadcastId => {
        try {
          await this.agent.del(`/broadcasts/${broadcastId}`);
        } catch (err) {
          handleAPIError(err);
        }
      },
      getPlayerURL: (broadcastId, options = {}) => {
        if (typeof broadcastId !== 'string' || !broadcastId) {
          throw new Error('Invalid argument. Expected broadcast id.');
        }

        const resourceUri = `https://cdn.bambuser.net/broadcasts/${broadcastId}`;
        const signedResourceUri = this.signResourceUri(resourceUri, options);
        return this.config.playerBaseUrl + '?resourceUri=' + encodeURIComponent(signedResourceUri);
      },
      createClip: async (broadcastId, start, end) => {
        if (typeof broadcastId !== 'string' || !broadcastId) {
          throw new Error('Invalid argument. Expected broadcast id.');
        }
        if (typeof start !== 'number' || start < 0) {
          throw new Error('Invalid argument. Expected start time as positive number.');
        }
        if (typeof end !== 'number' || end < 0) {
          throw new Error('Invalid argument. Expected start time as positive number.');
        }
        if (end <= start) {
          throw new Error('Invalid start and end time. End must be larger than start.');
        }
        let response;
        try {
          response = await this.agent.post('/broadcasts').send({
            source: {
              broadcastId,
              start,
              end
            }
          });
        } catch (err) {
          handleAPIError(err);
        }
        return response.body
      }
    };
  }

  get images() {
    return {
      get: (query = {}, options = {}) => {
        validateQueryParameters(query);
        let getter = getPaginatedGetter(this.agent, '/images', query);
        if (options.withPagination) return getter;
        return getter.next();
      },
      getById: async imageId => {
        let response;
        try {
          response = await this.agent.get(`/images/${imageId}`);
        } catch (err) {
          handleAPIError(err);
        }
        return response.body;
      },
      deleteById: async imageId => {
        try {
          await this.agent.del(`/images/${imageId}`);
        } catch (err) {
          handleAPIError(err);
        }
      }
    };
  }

  signResourceUri(resourceUri, options = {}) {
    if (!this.config.daId || !this.config.daSecret) {
      throw new Error('Missing signing keys');
    }

    const daParams = {
      da_id: this.config.daId,
      da_timestamp: Math.floor(Date.now() / 1000),
      da_nonce: Math.random(),
      da_signature_method: 'HMAC-SHA256',
    };

    let ttl = null;
    if (options.ttl) {
      if (typeof options.ttl !== 'number' || options.ttl <= 60) {
        throw new Error('Invalid ttl. Expected number of seconds (min 60).');
      }
      daParams.da_ttl = options.ttl;
    } else {
      daParams.static = 1;
    }

    const resourceUriWithDaParams = resourceUri + '?' + queryString.stringify(daParams);
    const stringToSign = 'GET ' + resourceUriWithDaParams;
    const signature = crypto.createHmac('sha256', this.config.daSecret).update(stringToSign).digest('hex');
    return resourceUriWithDaParams + '&da_signature=' + signature;
  }
}

BambuserAPI.errors = {
  ResourceNotFound,
  UnsupportedQueryParameter,
};

module.exports = BambuserAPI;
