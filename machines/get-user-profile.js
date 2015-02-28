module.exports = {


  friendlyName: 'Get user profile',


  description: 'Get a user\'s Twitter profile information.',


  extendedDescription: '',


  inputs: {

    consumerKey: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The `consumerKey` associated with one of your Twitter developer apps.',
      required: true,
      whereToGet: {
        url: 'http://dev.twitter.com/apps',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If you don\'t have any Twitter apps created yet, you\'ll need to make one first.'
      }
    },

    consumerSecret: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The `consumerSecret` associated with one of your Twitter developer apps.',
      required: true,
      whereToGet: {
        url: 'http://dev.twitter.com/apps',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If you don\'t have any Twitter apps created yet, you\'ll need to make one first.'
      }
    },

    screenName: {
      example: 'johngalt',
      description: 'The Twitter screen name (i.e. username) of a Twitter account to look up.',
      required: true
    },

    accessToken: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The access token for a given user (granted by Twitter)',
      extendedDescription: 'This "permanent OAuth token" is how Twitter knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessToken`.'
      },
      required: true
    },

    accessSecret: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The access secret for a given user (granted by Twitter)',
      extendedDescription: 'This "permanent OAuth secret" is how Twitter knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessSecret`.'
      },
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
        token: inputs.accessToken,
        token_secret: inputs.accessSecret
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
