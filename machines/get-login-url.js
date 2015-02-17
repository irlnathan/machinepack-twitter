module.exports = {
  friendlyName: 'Get login url',
  description: 'Get the URL on twitter.com that a user should visit to allow/deny the specified Twitter Developer app (i.e. your app).',
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
    callbackUrl: {
      example: 'http://localhost:1337/auth/callback',
      description: 'The callback URL where the end user will be redirected after visiting the login URL returned by this machine.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: '',
      example: 'https://twitter.com/oauth/authenticate?oauth_token=80Hl2t3SKgdPLyD0xMxoEPoJP3CEQSXV'
    }
  },
  fn: function(inputs, exits) {

    var request = require('request');
    var qs = require('querystring');

    var oauth = {
      callback: inputs.callbackUrl,
      consumer_key: inputs.consumerKey,
      consumer_secret: inputs.consumerSecret
    }

    var url = 'https://api.twitter.com/oauth/request_token';

    request.post({
      url: url,
      oauth: oauth
    }, function(e, r, body) {

      if (e) {
        return exits.error(e);
      }

      var access_token = qs.parse(body);

      return exits.success("https://twitter.com/oauth/authenticate?oauth_token=" + access_token.oauth_token);

    });
  }
}