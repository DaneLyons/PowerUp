var mongoose = require('mongoose'),
  PowerUp = require('../models/power_up'),
  async = require('async');

var dbUri;
if (process.env.NODE_ENV === 'production') {
  dbUri = process.env.MONGOLAB_URI;
} else {
  dbUri = 'mongodb://localhost/powerup';
}

mongoose.connect(dbUri);
PowerUp.find({}, function (err, power_ups) {
  async.mapSeries(power_ups, function (power_up, cb) {
    power_up.save();
  });
});