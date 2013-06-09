var mongoose = require('mongoose'),
  Grid = require('../models/grid'),
  async = require('async');

var dbUri;
if (process.env.NODE_ENV === 'production') {
  dbUri = process.env.MONGOLAB_URI;
} else {
  dbUri = 'mongodb://localhost/powerup';
}

console.log("Renaming grid user field...\n");

mongoose.connect(dbUri);
Grid.find({ owner: null }, function (err, grids) {
  async.mapSeries(grids, function (grid, cb) {
    grid.owner = grid.user;
    grid.save(function (err, grid) {
      console.log("Updated grid " + grid._id + " with owner " + grid.owner + "\n");
      if (err) { return cb(err); }
      return cb(null);
    });
  }, function (err) {
    if (err) { console.log("Error: " + err); }
    mongoose.disconnect();
    process.exit();
  });
});
