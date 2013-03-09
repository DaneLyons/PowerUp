var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamps'),
  Schema = mongoose.Schema;
  
var gridSchema = new Schema({
  name: String,
  workUnit: String,
  stats: {
    powerUps: Number
  }
});

gridSchema.plugin(timestamps);

var User = mongoose.model('User', userSchema);
module.exports = User;