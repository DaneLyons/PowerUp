var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;
  
var powerUpSchema = new Schema({
  position: Number,
  color: String,
  grid: { type: Schema.ObjectId, ref: 'PowerUp' }
}, {
  safe: true
});

powerUpSchema.plugin(timestamps);

var PowerUp = mongoose.model('PowerUp', powerUpSchema);
module.exports = PowerUp;