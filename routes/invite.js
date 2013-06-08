var Invite = require('../models/invite'),
  User = require('../models/user'),
  Grid = require('../models/grid');
  
exports.showInvite = function (req, res) {
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
      req.login(user, function (err) {
        console.log(err);
        res.render('invite/show.ejs', {
          "invite": invite,
          "stylesheets":["page","settings","auth"]
        });
      });
    });
  });
};

exports.acceptInvite = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  User.findById(req.user._id, function (err, user) {
    User.bcryptPassword(req.body.user, function (err, params) {
      user.passwordHash = params.passwordHash;
      user.passwordSalt = params.passwordSalt;
      user.save(function (err) {
        if (err) {
          console.log(err);
        }
        
        Invite.findById(req.params.id)
          .populate('grid')
          .exec(function (err, invite) {
            invite.isAccepted = true;
            invite.save(function (err, invite) {
              var gridUrl = "/grids/" + invite.grid.slug;
              res.redirect(gridUrl);
            });
          }
        );
      });
    });
  });
};