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
      description: 'The user id of a twitter user.',
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
        id: 42454543,
        id_str: '35344535',
        name: 'John Galt',
        screen_name: 'johngalt',
        location: 'Galt\'s Gulch',
        profile_location: null,
        description: 'Overall philosophical genius',
        url: 'http://t.co/UDSfsSDFd',
        entities: {
          url: {
            urls: [Object]
          },
          description: {
            urls: []
          }
        },
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
        status: {
          created_at: 'Wed Feb 11 20:38:11 +0000 2015',
          id: 24223423424234234,
          id_str: '23423423423424',
          text: '',
          source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
          truncated: false,
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: null,
          in_reply_to_user_id_str: null,
          in_reply_to_screen_name: null,
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          retweeted_status: {},
          retweet_count: 3,
          favorite_count: 0,
          entities: {
            hashtags: [Object],
            symbols: [],
            user_mentions: [Object],
            urls: [Object]
          },
          favorited: false,
          retweeted: true,
          possibly_sensitive: false,
          lang: 'en'
        },
        contributors_enabled: false,
        is_translator: false,
        is_translation_enabled: false,
        profile_background_color: 'C0DEED',
        profile_background_image_url: '',
        profile_background_image_url_https: '',
        profile_background_tile: false,
        profile_image_url: '',
        profile_image_url_https: '',
        profile_link_color: '0084B4',
        profile_sidebar_border_color: 'C0DEED',
        profile_sidebar_fill_color: 'DDEEF6',
        profile_text_color: '333333',
        profile_use_background_image: true,
        default_profile: true,
        default_profile_image: false,
        following: false,
        follow_request_sent: false,
        notifications: false,
        suspended: false,
        needs_phone_verification: false
      }
    }
  },
  fn: function(inputs, exits) {

    var request = require('request');
    var qst = require('querystring');

    var oauth = {
      consumer_key: inputs.consumerKey,
      consumer_secret: inputs.consumerSecret,
      token: inputs.permUserToken,
      token_secret: inputs.permUserSecret
    }

    var options = {
      url: 'https://api.twitter.com/1.1/users/show.json',
      qs: {
        screen_name: inputs.screen_name,
        user_id: inputs.userId
      },
      oauth: oauth,
      json: true
    }

    request.get(options, function(e, r, user) {

      console.log(user)
      if (e) {
        console.log(e);
        return exits.error(e);
      }
      return exits.success(user);
    });
  }
}