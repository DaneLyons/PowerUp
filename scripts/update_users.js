var mongoose = require('mongoose'),
  User = require('../models/user'),
  async = require('async');

var dbUri;
if (process.env.NODE_ENV === 'production') {
  dbUri = process.env.MONGOLAB_URI;
} else {
  dbUri = 'mongodb://localhost/powerup';
}

mongoose.connect(dbUri);
User.find({}, function (err, users) {
  async.mapSeries(users, function (user, cb) {
    user.save();
  });
});