var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;
  
var gridSchema = new Schema({
  name: String,
  workUnit: String,
  stats: {
    powerUps: Number
  },
  powerUps: [ { type: Schema.ObjectId, ref: 'PowerUp' } ],
  user: { type: Schema.ObjectId, ref: 'User' },
  public: { type: Boolean, default: false },
  slug: String
});

gridSchema.plugin(timestamps);

var Grid = mongoose.model('Grid', gridSchema);
module.exports = Grid;