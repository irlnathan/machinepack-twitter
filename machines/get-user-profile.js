module.exports = {


  friendlyName: 'Get user profile',


  description: 'Get a user\'s Twitter profile information.',


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
      extendedDescription: 'This is Twitter knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack.'
      },
      required: true
    },

    permUserSecret: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The permanent OAuth secret for a given user.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack.'
      },
      required: true
    },

    screenName: {
      example: 'johngalt',
      description: 'The screen name of the user to look up.',
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
        followersCount: 5050234234,
        friendsCount: 23423423423,
        listedCount: 2342,
        createdAt: 'Wed Jan 12 21:49:17 +0000 2011',
        favouritesCount: 1,
        utcOffset: -18000,
        timezone: 'Eastern Time (US & Canada)',
        geoEnabled: false,
        verified: false,
        statusesCount: 23423,
        lang: 'en',
        suspended: false
      }
    }

  },


  fn: function(inputs, exits) {

    var request = require('request');

    request.get({
      url: 'https://api.twitter.com/1.1/users/show.json',
      qs: (function _determineParams (){
        // EITHER screen name or user id is required, but NOT BOTH!
        // (for now we just allow username)
        var _params = {};
        if (inputs.screenName) {
          _params.screen_name = inputs.screenName;
        }
        return _params;
      })(),
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
      return exits.success({
        name: body.name,
        screenName: body.screen_name,
        location: body.location,
        description: body.description,
        url: body.url,
        protected: body.protected,
        followersCount: body.followers_count,
        friendsCount: body.friends_count,
        listedCount: body.listed_count,
        createdAt: body.created_at,
        favoritesCount: body.favourites_count,
        utcOffset: body.utc_offset,
        timezone: body.time_zone,
        geoEnabled: body.geo_enabled,
        verified: body.verified,
        statusesCount: body.statuses_count,
        lang: body.lang,
        suspended: body.suspended
      });
    });
  }


};
