var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  Grid = require('./grid'),
  _ = require('underscore');
  
var userSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  grids: [ { type: Schema.ObjectId, ref: 'User' } ]
});

userSchema.plugin(timestamps);

userSchema.pre('save', function (next) {
  var newUser = this;
  if (!newUser) {
    next();
    return;
  }
  
  User.findById(newUser._id).populate('grids').exec(function (err, oldUser) {
    if (err || !oldUser) {
      next();
      return;
    }
    
    if (oldUser.grids != newUser.grids) {
      _.without(newUser.grids, oldUser.grids, function (gridList) {
        _.each(gridList, function (grid) {
          Grid.findById(grid._id, function (err, gridInstance) {
            gridInstance.user = newUser._id;
            gridInstance.save();
          });
        });
      });
    };
    
    console.log(oldUser.name == newUser.name);
    next();
    return;
  });
});
var User = mongoose.model('User', userSchema);
module.exports = User;