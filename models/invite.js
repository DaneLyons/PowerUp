var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uuid = require('node-uuid'),
  timestamps = require('mongoose-timestamp');
  
var inviteSchema = new Schema({
  fromUser: { type: Schema.ObjectId, ref: 'User' },
  toUser: { type: Schema.ObjectId, ref: 'User' },
  toParams: {
    email: String,
    name: String
  },
  grid: { type: Schema.ObjectId, ref: 'User' },
  isSent: { type: Boolean, default: false },
  isAccepted: { type: Boolean, default: false },
  token: { type: String, default: uuid.v4() }
}, {
  safe: true
});

inviteSchema.plugin(timestamps);

var Invite = mongoose.model('Invite', inviteSchema);
module.exports = Invite;
