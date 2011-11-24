var vows = require('vows');
var assert = require('assert');
var util = require('util');
var soundcloud = require('passport-soundcloud');


vows.describe('passport-soundcloud').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(soundcloud.version);
    },
  },
  
}).export(module);
