module.exports = {


  friendlyName: 'Get login URL',


  description: 'Get the URL on twitter.com that a user should visit to allow/deny the specified Twitter Developer app (i.e. your app).',


  inputs: {

    consumerKey: require('../constants/consumerKey.required'),

    consumerSecret: require('../constants/consumerSecret.required'),

    callbackUrl: {
      example: 'http://localhost:1337/auth/callback',
      description: 'The callback URL where the end user will be redirected after visiting the login URL returned by this machine.',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'URL',
      outputDescription: 'The custom URL on Twitter.com where a user can allow/deny this Twitter app.',
      outputExample: 'https://twitter.com/oauth/authenticate?oauth_token=80Hl2t3SKgdPLyD0xMxoEPoJP3CEQSXV'
    }

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var qs = require('querystring');
    var request = require('request');

    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        callback: inputs.callbackUrl,
        consumer_key: inputs.consumerKey,// eslint-disable-line camelcase
        consumer_secret: inputs.consumerSecret// eslint-disable-line camelcase
      }
    }, function(err, response, body) {
      if (err) { return exits.error(err); }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(new Error('Unexpected response from Twitter API: '+response.statusCode+' :: '+util.inspect(body,{depth:5})));
      }

      var parsedResBody;
      try {
        parsedResBody = qs.parse(body);
      }
      catch (e) { return exits.error(e); }

      return exits.success('https://twitter.com/oauth/authenticate?oauth_token=' + parsedResBody.oauth_token);

    });
  }


};
