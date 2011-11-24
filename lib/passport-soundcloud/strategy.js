/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


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
  this._oauth2.getProtectedResource('https://api.soundcloud.com/me.json', accessToken, function (err, body, res) {
    if (err) { return done(err); }
    
    try {
      o = JSON.parse(body);
      
      var profile = { provider: 'soundcloud' };
      profile.id = o.id;
      profile.displayName = o.full_name;
      
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
