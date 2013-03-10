var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  Grid = require('./grid');
  
var userSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  grids: [ { type: Schema.ObjectId, ref: 'User' } ]
});

userSchema.plugin(timestamps);

var User = mongoose.model('User', userSchema);
module.exports = User;