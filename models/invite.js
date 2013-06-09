var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uuid = require('node-uuid'),
  timestamps = require('mongoose-timestamp'),
  User = require('./user'),
  Grid = require('./grid'),
  Mailer = require('../lib/mailer');
  
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

inviteSchema.post('save', function (invite) {
  if (!invite.isSent) {
    Invite.findById(invite._id, function (err, invite) {
      Grid.findById(invite.grid, function (err, grid) {
        if (err) { console.log(err); }

        User.findOrCreate({email: invite.toParams.email}, function (err, user) {
          if (err) { console.log(err); }

          var baseUrl = "http://" + ((process.env.NODE_ENV === 'production') ? 'powerup.io' : 'localhost:3000');
          var inviteUrl = baseUrl + "/invites/" + invite._id;
          inviteUrl += "?token=" + invite.token;

          var subject = "";
          if (invite.fromUser.name) {
            subject = invite.fromUser.name + "wants to collaborate with you.";
          } else {
            subject = "You've been invited to collaborate.";
          }
          var mailerParams = {
            to: user.email,
            subject: subject,
            text: ["Hi there,",
              "",
              "You've been invited to the \"" + grid.name + "\" grid on PowerUp.io. To get started, click the link below:",
              "",
              inviteUrl,
              "",
              "Power on!",
              "- Team PowerUp"].join('\n')
          };

          Mailer.send(mailerParams, function (err) {
            if (err) { console.log(err); }

            invite.isSent = true;
            invite.toUser = user._id;
            invite.save(function (err) {
              if (err) { console.log(err); }
            });
          });
        });
      });
    });
  }
});

var Invite = mongoose.model('Invite', inviteSchema);
module.exports = Invite;
