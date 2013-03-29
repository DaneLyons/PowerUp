var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
var gridButtonSchema = new Schema({
  grid: { type: Schema.ObjectId, ref: 'Grid' },
  workUnit: String,
  increment: Number
});

var GridButton = mongoose.model('GridButton', gridButtonSchema);
module.exports = GridButton;