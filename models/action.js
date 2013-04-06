var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;
  
var actionSchema = new Schema({
  actionType: String,
  actionObjectType: String,
  actionObjectId: String,
  user: { type: Schema.ObjectId, ref: 'User' },
  metadata: {
    stats: {}
  },
  object: {}
}, {
  safe: true
});

actionSchema.plugin(timestamps);

var Action = mongoose.model('Action', actionSchema);
module.exports = Action;