var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;
  
var powerUpSchema = new Schema({
  position: Number,
  grid: { type: Schema.ObjectId, ref: 'PowerUp' }
});

userSchema.plugin(timestamps);

var PowerUp = mongoose.model('PowerUp', powerUpSchema);
module.exports = PowerUp;