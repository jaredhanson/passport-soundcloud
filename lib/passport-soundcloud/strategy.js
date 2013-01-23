/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The SoundCloud authentication strategy authenticates requests by delegating
 * to SoundCloud using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your SoundCloud application's client id
 *   - `clientSecret`  your SoundCloud application's client secret
 *   - `callbackURL`   URL to which SoundCloud will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new SoundCloudStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/soundcloud/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://soundcloud.com/connect';
  options.tokenURL = options.tokenURL || 'https://api.soundcloud.com/oauth2/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'soundcloud';
  
  // NOTE: Due to OAuth 2.0 implementations arising at different points and
  //       drafts in the specification process, the parameter used to denote the
  //       access token is not always consistent.    As of OAuth 2.0 draft 22,
  //       the parameter is named "access_token".  However, SoundCloud's
  //       implementation expects it to be named "oauth_token".  For further
  //       information, refer to: http://developers.soundcloud.com/docs/api/authentication
  this._oauth2.setAccessTokenName("oauth_token");
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from SoundCloud.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `soundcloud`
 *   - `id`               the user's SoundCloud ID
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://api.soundcloud.com/me.json', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'soundcloud' };
      profile.id = json.id;
      profile.displayName = json.full_name;
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
