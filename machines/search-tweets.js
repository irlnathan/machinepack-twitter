module.exports = {


  friendlyName: 'Search tweets',


  description: 'Search Twitter tweets.',


  extendedDescription: '',


  inputs: {

    q: {
      example: 'pizza',
      description: 'The search query.',
      defaultsTo: ''
    },

    latitude: {
      example: 32
    },

    longitude: {
      example: 24
    },

    radius: {
      example: 2,
      description: 'The radius to search (in km).',
      defaultsTo: 5
    },

    consumerKey: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The `consumerKey` associated with one of your Twitter developer apps.',
      required: false,
      whereToGet: {
        url: 'http://dev.twitter.com/apps',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If you don\'t have any Twitter apps created yet, you\'ll need to make one first.'
      }
    },

    consumerSecret: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The `consumerSecret` associated with one of your Twitter developer apps.',
      required: false,
      whereToGet: {
        url: 'http://dev.twitter.com/apps',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If you don\'t have any Twitter apps created yet, you\'ll need to make one first.'
      }
    },

    accessToken: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The access token for a given user (granted by Twitter)',
      extendedDescription: 'This "permanent OAuth token" is how Twitter knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessToken`.'
      },
      required: false
    },

    accessSecret: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The access secret for a given user (granted by Twitter)',
      extendedDescription: 'This "permanent OAuth secret" is how Twitter knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessSecret`.'
      },
      required: false
    },

    bearerToken: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'Can be used in place of `consumerKey`, `consumerSecret`, `accessToken`, and `accessSecret`.',
      whereToGet: {
        description: 'Run the `getBearerToken` machine in this pack and use the returned `bearerToken`.'
      },
      required: false
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Tweets',
      outputDescription: 'An array of matching tweets.',
      example: ['===']
    }

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var _ = require('lodash');
    var request = require('request');

    // If no bearer token was provided, then `consumerKey`, `consumerSecret`,
    // `accessToken`, and `accessSecret` must ALL be provided.
    if(_.isUndefined(inputs.bearerToken) &&
      ( _.isUndefined(inputs.consumerKey) ||
        _.isUndefined(inputs.consumerSecret) ||
        _.isUndefined(inputs.accessToken) ||
        _.isUndefined(inputs.accessSecret))) {
      return exits.error(new Error('Usage error: If `bearerToken` was not provided, then `consumerKey`, `consumerSecret`, `accessToken`, and `accessSecret` must ALL be provided.'));
    }

    // If bearer token was provided, then `consumerKey`, `consumerSecret`,
    // `accessToken`, and `accessSecret` must NOT be provided.
    if(!_.isUndefined(inputs.bearerToken) &&
      ( !_.isUndefined(inputs.consumerKey) ||
        !_.isUndefined(inputs.consumerSecret) ||
        !_.isUndefined(inputs.accessToken) ||
        !_.isUndefined(inputs.accessSecret))) {
      return exits.error(new Error('Usage error: If `bearerToken` was provided, then other credentials should not be provided.'));
    }

    // SOME form of primary filter must be used-- either a search query (q) or location (lat/long)
    // > We check only for lat here, because we validate the copresence of lat/long later anyways.
    if(inputs.q === '' && _.isUndefined(inputs.latitude)) {
      return exits.error(new Error('Usage error: SOME form of primary filter must be used-- either a search query (`q`) or location (`latitude`+`longitude`).'));
    }

    var requestOpts = {
      url: 'https://api.twitter.com/1.1/search/tweets.json',
      qs: {},
      json: true
    };

    if(!_.isUndefined(inputs.q)) {
      requestOpts.qs.q = inputs.q;
    }//>-

    if(!_.isUndefined(inputs.latitude) || !_.isUndefined(inputs.longitude)) {
      if(!_.isUndefined(inputs.latitude) && _.isUndefined(inputs.longitude) || _.isUndefined(inputs.latitude) && !_.isUndefined(inputs.longitude)) {
        return exits.error(new Error('If `latitude` is specified, then `longitude` must also be specified (and vice versa)'));
      }
      requestOpts.qs.geocode = [inputs.latitude, inputs.longitude, inputs.radius].join(',');
    }//>-


    if(!_.isUndefined(inputs.bearerToken)) {
      requestOpts.headers = {
        Authorization: 'Bearer '+inputs.bearerToken
      };
    }
    else {
      requestOpts.oauth = {
        consumer_key: inputs.consumerKey,
        consumer_secret: inputs.consumerSecret,
        token: inputs.accessToken,
        token_secret: inputs.accessSecret
      };
    }

    request.get(requestOpts, function(err, response, body) {
      if (err) {
        return exits.error(err);
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(new Error('Twitter responded with a non 2xx status code:'+ response.statusCode + '   ' + util.inspect(body)));
      }

      var tweets;
      try {
        tweets = body.statuses;
      } catch (e) { return exits.error(e); }

      return exits.success(tweets);
    });
  }


};
