var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;
  
var userSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  passwordSalt: String
});

userSchema.plugin(timestamps);

var User = mongoose.model('User', userSchema);
module.exports = User;