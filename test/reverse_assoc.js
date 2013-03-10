var mongoose = require('mongoose'),
  User = require('./models/user'),
  Grid = require('./models/grid'),
  winston = require('winston');
  
var user = new User({ name: 'foo' });
var grid = new Grid({ name: 'bar' });
user.save()
grid.save();

user.grids.push(grid._id);
user.save();

Grid.findById(grid._id, function (err, grid) {
  winston.log("G: " + grid.user);
})