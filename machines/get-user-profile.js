module.exports = {
  friendlyName: 'Get user profile',
  description: 'List all of the user\'s profile information.',
  extendedDescription: '',
  inputs: {
    consumerKey: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The oauth_consumer_key identifies which application is making the request. ',
      required: true,
      whereToGet: {
        url: 'http://dev.twitter.com/apps',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: ''
      }
    },
    consumerSecret: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The oauth_consumer_key identifies which application is making the request. ',
      required: true,
      whereToGet: {
        url: 'http://dev.twitter.com/apps',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: ''
      }
    },
    permUserToken: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The permanent OAuth token for a given user.',
      required: true
    },
    permUserSecret: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The permanent OAuth secret for a given user.',
      required: true
    },
    screenName: {
      example: 'johngalt',
      description: 'The screen name for a given user.',
      required: true
    },
    userId: {
      example: '234544343',
      description: 'The user id of a Twitter user.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Returns the user\'s profile.',
      example: {
        name: 'John Galt',
        screen_name: 'johngalt',
        location: 'Galt\'s Gulch',
        description: 'Overall philosophical genius',
        url: 'http://t.co/UDSfsSDFd',
        protected: false,
        followers_count: 5050234234,
        friends_count: 23423423423,
        listed_count: 2342,
        created_at: 'Wed Jan 12 21:49:17 +0000 2011',
        favourites_count: 1,
        utc_offset: -18000,
        time_zone: 'Eastern Time (US & Canada)',
        geo_enabled: false,
        verified: false,
        statuses_count: 23423,
        lang: 'en',
        suspended: false
      }
    }
  },
  fn: function(inputs, exits) {

    var request = require('request');

    request.get({
      url: 'https://api.twitter.com/1.1/users/show.json',
      qs: {
        screen_name: inputs.screenName,
        user_id: inputs.userId
      },
      oauth: {
        consumer_key: inputs.consumerKey,
        consumer_secret: inputs.consumerSecret,
        token: inputs.permUserToken,
        token_secret: inputs.permUserSecret
      },
      json: true
    }, function(err, response, body) {
      if (err) {
        return exits.error(err);
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(response.statusCode);
      }
      return exits.success(body);
    });
  }
};
