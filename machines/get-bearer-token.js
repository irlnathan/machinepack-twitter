module.exports = {


  friendlyName: 'Get bearer token',


  description: 'Generate a new bearer token for your app.',


  extendedDescription: 'This is not tied to any specific end user.',


  moreInfoUrl: 'https://dev.twitter.com/oauth/application-only',


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

  },


  exits: {

    success: {
      outputDescription: 'The bearer token for this Twitter app.',
      example: '847489329-998DSdafaasdDSF08asdfda08agf6ad6fsdaa08dasdaf76sa5'
    }

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var request = require('request');

    request.post({
      url: 'https://api.twitter.com/oauth2/token',
      headers: {
        Authorization: 'Basic ' + Buffer.from(inputs.consumerKey+':'+inputs.consumerSecret).toString('base64'),
        'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: 'grant_type=client_credentials'
    }, function(err, response, body) {
      if (err) {
        return exits.error(err);
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(new Error('Twitter responded with a non 2xx status code:'+ response.statusCode + '   ' + util.inspect(body)));
      }

      try {
        body = JSON.parse(body);
      }
      catch (e) { return exits.error(e); }

      if(body.token_type !== 'bearer') {
        return exits.error(new Error('Consistency violation: invalid token_type. Should be \'bearer\', but instead got:'+util.inspect(body.token_type)+''));
      }

      return exits.success(body.access_token);

    });
  }


};
