'use strict';
const superagent = require('superagent');
const {
  getPaginatedGetter
} = require('./utils');

class IrisPlatformAPI {
  constructor(config) {
    if (typeof config === 'string') config = {apiKey: config};
    this.config = Object.assign({
      apiUrl: 'https://api.irisplatform.io',
      apiKey: null,
    }, config || {});
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
      findAll: (query, options) => {
        options = options || {};
        let getter = getPaginatedGetter(this.agent, '/broadcasts', query);
        if (options.withPagination) return getter;
        return getter.next();
      },
      findById: async broadcastId => {
        let response = await this.agent.get(`/broadcasts/${broadcastId}`);
        return response.body;
      },
      deleteById: async broadcastId => {
        return this.agent.del(`/broadcasts/${broadcastId}`);
      }
    };
  }

  get images() {
    return {
      findAll: (query, options) => {
        options = options || {};
        let getter = getPaginatedGetter(this.agent, '/images', query);
        if (options.withPagination) return getter;
        return getter.next();
      },
      findById: async imageId => {
        let response = await this.agent.get(`/images/${imageId}`);
        return response.body;
      },
      deleteById: async imageId => {
        return this.agent.del(`/images/${imageId}`);
      }
    };
  }
}

module.exports = IrisPlatformAPI;
