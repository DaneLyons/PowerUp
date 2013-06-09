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
        
        Invite.findById(req.params.id, function (err, invite) {
          if (err) { console.log(err); }
          
          Grid.findById(invite.grid, function (err, grid) {
            if (err) { console.log(err); }
            
            invite.isAccepted = true;
            invite.save(function (err, invite) {
              if (err) { console.log(err); }
              
              user.grids.push(grid._id);
              user.save(function (err, user) {
                grid.collaborators.push(user._id);
                grid.save(function (err, grid) {
                  var gridUrl = "/grids/" + grid.slug;
                  res.redirect(gridUrl);
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.deleteInvite = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  Invite.findOne({
    fromUser: req.user._id,
    _id: req.params.id 
  }, function (err, invite) {
    invite.remove(function (err) {
      if (err) { console.log(err); }
      res.redirect('back');
    });    
  });
}