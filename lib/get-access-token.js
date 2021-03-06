module.exports = {


  friendlyName: 'Get access token',


  description: 'Generate a new access token for acting on behalf of a particular Twitter user account.',


  extendedDescription: 'This machine should be used from your Twitter "webhook" (i.e. not exactly a true webhook, but the "callback route" that Twitter will redirect the user back to based on the `callbackUrl` you specify.  Note that this redirect URL will have bundled two values: "oauth_token" and "oauth_verifier" -- both of which should be passed to this machine in order to get the access token.  The access token returned by this machine can be used to authorize your subsequent requests to the Twitter API, allowing you to access/act on behalf of this particular user\'s Twitter account.)',


  moreInfoUrl: 'https://dev.twitter.com/web/sign-in/implementing',


  inputs: {

    consumerKey: require('../constants/consumerKey.required'),

    consumerSecret: require('../constants/consumerSecret.required'),

    oauthToken: {
      example: 'UL1866Vlkl0aZyPw2Kd2u592D17Xl1uE',
      description: 'The token generated by Twitter and provided to the callbackUrl as "oauth_token".',
      extendedDescription: 'This is generated by Twitter and passed as a parameter when redirecting users to the callbackUrl you specified- but only if the user chooses to grant your app the requested permissions.',
      whereToGet: {
        url: 'https://g.twimg.com/dev/sites/default/files/images_documentation/sign-in-flow3-3legged.png',
        description: 'Grab the value of the parameter, e.g. req.param(\'oauth_token\')'
      },
      required: true
    },

    oauthVerifier: {
      example: 'xEj5XxGFWe6vPiJFofYgVMZjw6eVc6Mw',
      description: 'The verification code generated by Twitter and provided to the callbackUrl as "oauth_verifier".',
      extendedDescription: 'This is generated by Twitter and passed as a parameter when redirecting users to the callbackUrl you specified- but only if the user chooses to grant your app the requested permissions.',
      whereToGet: {
        url: 'https://g.twimg.com/dev/sites/default/files/images_documentation/sign-in-flow3-3legged.png',
        description: 'Grab the value of the parameter, e.g. req.param(\'oauth_verifier\')'
      },
      required: true
    }

  },


  exits: {

    success: {
      outputDescription: 'The user\'s permanent tokens, id, and screen name.',
      outputExample: {
        accessToken: '847489329-998DSdafaasdDSF08asdfda08agf6ad6fsdaa08dasdaf76sa5',
        accessSecret: 'SDFSssdfsdf9&SDfSDFSDFSfd9877ssdf',
        screenName: 'johngalt',
        userId: '54952598'
      }
    }

  },


  fn: function(inputs, exits) {

    var util = require('util');
    var request = require('request');
    var qs = require('querystring');

    request.post({
      url: 'https://api.twitter.com/oauth/access_token',
      oauth: {
        consumer_key: inputs.consumerKey,// eslint-disable-line camelcase
        consumer_secret: inputs.consumerSecret,// eslint-disable-line camelcase
        token: inputs.oauthToken,
        verifier: inputs.oauthVerifier
      }
    }, function(err, response, body) {
      if (err) { return exits.error(err); }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(new Error('Unexpected response from Twitter API: '+response.statusCode+' :: '+util.inspect(body,{depth:5})));
      }

      var parsedResBody;
      try {
        // e.g.  (don't worry, this one isn't real!)
        // oauth_token=949398-B34829ABABEFSI242AAGa32&oauth_token_secret=42Ga2gj249gADg903ah32gasdGanv2139mmadval123D&user_id=3483938&screen_name=mikermcneil
        parsedResBody = qs.parse(body);
      } catch (e) { return exits.error(e); }

      return exits.success({
        userId: parsedResBody.user_id,
        screenName: parsedResBody.screen_name,
        accessToken: parsedResBody.oauth_token,
        accessSecret: parsedResBody.oauth_token_secret
      });

    });
  }


};
