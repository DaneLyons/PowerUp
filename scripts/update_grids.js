var mongoose = require('mongoose'),
  Grid = require('../models/grid'),
  async = require('async');

var dbUri;
if (process.env.NODE_ENV === 'production') {
  dbUri = process.env.MONGOLAB_URI;
} else {
  dbUri = 'mongodb://localhost/powerup';
}

mongoose.connect(dbUri);
Grid.find({}, function (err, grids) {
  async.mapSeries(grids, function (grid, cb) {
    grid.save();
  });
});