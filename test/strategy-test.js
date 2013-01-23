var vows = require('vows');
var assert = require('assert');
var util = require('util');
var SoundCloudStrategy = require('passport-soundcloud/strategy');


vows.describe('SoundCloudStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new SoundCloudStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named soundcloud': function (strategy) {
      assert.equal(strategy.name, 'soundcloud');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new SoundCloudStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{ \
          "id": 3207, \
          "permalink": "jwagener", \
          "username": "Johannes Wagener", \
          "uri": "https://api.soundcloud.com/users/3207", \
          "permalink_url": "http://soundcloud.com/jwagener", \
          "avatar_url": "http://i1.sndcdn.com/avatars-000001552142-pbw8yd-large.jpg?142a848", \
          "country": "Germany", \
          "full_name": "Johannes Wagener", \
          "city": "Berlin", \
          "description": "Hacker at SoundCloud", \
          "discogs_name": null, \
          "myspace_name": null, \
          "website": "http://johannes.wagener.cc", \
          "website_title": "johannes.wagener.cc", \
          "online": true, \
          "track_count": 12, \
          "playlist_count": 1, \
          "followers_count": 416, \
          "followings_count": 174, \
          "public_favorites_count": 26, \
          "plan": "Pro Plus", \
          "private_tracks_count": 63, \
          "private_playlists_count": 3, \
          "primary_email_confirmed": true \
        }';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'soundcloud');
        assert.equal(profile.id, '3207');
        assert.equal(profile.displayName, 'Johannes Wagener');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new SoundCloudStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);
