var mongoose = require('mongoose'),
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

actionSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  
  next();
});

var Action = mongoose.model('Action', actionSchema);
module.exports = Action;