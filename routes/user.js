var Grid = require('../models/grid'),
  GridButton = require('../models/grid_button'),
  User = require('../models/user'),
  Preference = require('../models/preference'),
  inflect = require('i')();
  
exports.settings = function (req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/');
    return;
  }
  User.findById(req.user._id, function (err, user) {
    Preference.findOrCreate({ user:req.user._id }, function(err,pref){
      res.render("user/settings.ejs", {
        "title":"PowerUp Settings",
        "stylesheets":["page","settings","auth"],
        "user":user,
        "pref":pref
      });
    });
  });
};

exports.update = function (req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/');
    return;
  }
  User.findById(res.locals.currentUser._id).exec(function (err, user) {
    Preference.findOne({ user: user._id })
      .exec(function (err, preferences) {
        for(var param in req.body.pref){
          preferences[param] = req.body.pref[param]
        }
        preferences.save();
      });
    
    for(var param in req.body.user){
      user[param] = req.body.user[param]
    }
    
    user.save(function (err) {
      if (err) {
        throw new Error("");
      }
      res.redirect('/settings');
    });
  });
};

exports.password = function (req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/');
    return;
  }
  User.findById(req.user._id, function (err, user) {
    res.render("user/password.ejs", {
      "title":"Change Password",
      "stylesheets":["page","settings","auth"],
      "user":user
    });
  });
};

exports.updatePassword = function (req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/');
    return;
  }
  User.findById(res.locals.currentUser._id).exec(function (err, user) {
    User.bcryptPassword(req.body.user,function(err,params){
      user.passwordHash = params.passwordHash;
      user.passwordSalt = params.passwordSalt;
      user.save(function (err) {
        if (err) {
          throw new Error("");
        }
        res.redirect('/change_password');
      });
    });
  });
};

exports.join = function (req, res) {
  res.render('user/join', {
    "stylesheets":["page","settings","auth", "join"]
  });
};

exports.postJoin = function (req, res) {
  res.redirect('/');
};