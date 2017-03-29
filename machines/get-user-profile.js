module.exports = {


  friendlyName: 'Get user profile',


  description: 'Get a user\'s Twitter profile information.',


  inputs: {

    screenName: {
      example: 'johngalt',
      description: 'The Twitter screen name (i.e. username) of a Twitter account to look up.',
      required: true
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


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns the user\'s profile.',
      example: {
        name: 'John Galt',
        screenName: 'johngalt',
        profileImageUrl: 'http://pbs.twimg.com/profile_images/3367735923/e3fa48371ed40fb3466fc2cdec18a3aa_normal.jpeg',
        profileImageUrlHttps: 'https://pbs.twimg.com/profile_images/3367735923/e3fa48371ed40fb3466fc2cdec18a3aa_normal.jpeg',
        bannerImageUrl: 'https://pbs.twimg.com/profile_banners/54952598/1354583726',
        location: 'Galt\'s Gulch',
        description: 'Overall philosophical genius',
        createdAt: '2009-07-08T16:50:31.000Z',
        url: 'http://t.co/UDSfsSDFd',
        followersCount: 5050234234,
        friendsCount: 23423423423,
        listedCount: 2342,
        favoritesCount: 124,
        statusesCount: 23423,
        utcOffset: -18000,
        timezone: 'Eastern Time (US & Canada)',
        language: 'en',
        isGeoEnabled: true,
        isProtected: true,
        isVerified: true,
        isSuspended: true
      }
    }

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var request = require('request');
    var _ = require('lodash');

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

    var requestOpts = {
      url: 'https://api.twitter.com/1.1/users/show.json',
      qs: (function _determineParams (){
        // EITHER screen name or user id is required, but NOT BOTH!
        // (for now we just allow username)
        var _params = {};
        _params.screen_name = inputs.screenName;// eslint-disable-line camelcase
        return _params;
      })(),
      json: true
    };

    if(!_.isUndefined(inputs.bearerToken)) {
      requestOpts.headers = {
        Authorization: 'Bearer '+inputs.bearerToken
      };
    }
    else {
      requestOpts.oauth = {
        consumer_key: inputs.consumerKey,// eslint-disable-line camelcase
        consumer_secret: inputs.consumerSecret,// eslint-disable-line camelcase
        token: inputs.accessToken,
        token_secret: inputs.accessSecret// eslint-disable-line camelcase
      };
    }

    request.get(requestOpts, function(err, response, body) {
      if (err) {
        return exits.error(err);
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(new Error('Twitter responded with a non 2xx status code:'+ response.statusCode + '   ' + util.inspect(body)));
      }

      return exits.success({
        name: body.name,
        screenName: body.screen_name,
        profileImageUrl: body.profile_image_url,
        profileImageUrlHttps: body.profile_image_url_https,
        bannerImageUrl: body.profile_banner_url,
        location: body.location,
        description: body.description,
        url: body.url,
        followersCount: body.followers_count,
        friendsCount: body.friends_count,
        listedCount: body.listed_count,
        createdAt: (new Date(body.created_at)).toJSON(),
        favoritesCount: body.favourites_count,
        utcOffset: body.utc_offset,
        timezone: body.time_zone,
        isVerified: body.verified,
        language: body.lang,
        isGeoEnabled: body.geo_enabled,
        statusesCount: body.statuses_count,
        isProtected: body.protected,
        isSuspended: body.suspended
      });
    });
  }


};
