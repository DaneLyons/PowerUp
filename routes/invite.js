var Invite = require('../models/invite'),
  User = require('../models/user');
  
exports.acceptInvite = function (req, res) {
  Invite.findOne({
    _id: req.params.id,
    token: req.query.token
  }, function (err, invite) {
    if (err) {
      console.log(err);
    }
    if (!invite) {
      res.redirect('/');
      return;
    }
    
    User.findById(invite.toUser, function (err, user) {
      req.login(user);
      res.redirect('/settings');
    });
  });
};

exports.postAcceptInvite = function (req, res) {
  
};