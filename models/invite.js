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
    Grid.findById(invite.grid, function (err, grid) {
      if (err) { console.log(err); }

      User.findOne(invite.toParams, function (err, user) {
        if (err) { console.log(err); }

        if (user) {
          inviteUser(user);
        } else {
          User.findOrCreate(toParams, function (err, user) {
            if (err) { console.log(err); }
            inviteUser(user);
          });
        }

        function inviteUser(user) {
          var baseUrl = "http://" + ((process.env.NODE_ENV === 'production') ? 'powerup.io' : 'localhost:3000');
          var inviteUrl = baseUrl + "/invites/" + invite._id + "/accept";
          inviteUrl += "?token=" + invite.token;

          var mailerParams = {
            from: 'welcome@powerup.io',
            to: user.email,
            subject: "You're invited to a grid on PowerUp.io.",
            text: ["Hi there,",
              "",
              "You've been invited to the " + grid.name + " grid on PowerUp.io. To get started, click the link below:",
              "",
              inviteUrl,
              "",
              "Power on!",
              "- Team PowerUp"].join('\n')
          };
          Mailer.send(mailerParams, function (err) {
            if (err) { console.log(err); }

            invite.isSent = true;
            invite.save(function (err) {
              if (err) { console.log(err); }
            });
          });
        }
      });
    });
  }
});

var Invite = mongoose.model('Invite', inviteSchema);
module.exports = Invite;
