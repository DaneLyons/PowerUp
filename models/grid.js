var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamps'),
  Schema = mongoose.Schema;
  
var gridSchema = new Schema({
  name: String,
  workUnit: String,
  stats: {
    powerUps: Number
  },
  powerUps: [ { type: Schema.ObjectId, ref: 'PowerUp' } ],
  user: { type: Schema.ObjectId, ref: 'User' }
});

gridSchema.plugin(timestamps);

var Grid = mongoose.model('Grid', gridSchema);
module.exports = Grid;