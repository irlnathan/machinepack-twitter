module.exports = {


  friendlyName: 'Get login url',


  description: 'Get the URL on twitter.com that a user should visit to allow/deny the specified Twitter Developer app (i.e. your app).',


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
      description: 'The initial URL where a user can allow/deny a specified Twitter app.',
      example: 'https://twitter.com/oauth/authenticate?oauth_token=80Hl2t3SKgdPLyD0xMxoEPoJP3CEQSXV'
    }

  },


  fn: function(inputs, exits) {

    var request = require('request');
    var qs = require('querystring');

    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        callback: inputs.callbackUrl,
        consumer_key: inputs.consumerKey,
        consumer_secret: inputs.consumerSecret
      }
    }, function(err, response, body) {
      if (err) {
        return exits.error(err);
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(response.statusCode);
      }

      var access_token = qs.parse(body);

      return exits.success('https://twitter.com/oauth/authenticate?oauth_token=' + access_token.oauth_token);

    });
  }


};
