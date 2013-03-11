var User = require('../models/user'),
  util = require('util');

exports.signIn = function (req, res) {  
  if (req.user) {
    res.redirect('/new');
  } else{
    res.render('auth/sign_in');
  }
};

exports.signUp = function (req, res) {  
  if (req.user) {
    res.redirect('back');
  } else{
    res.render('auth/sign_up');
  }
};

exports.postSignUp = function (req, res) {
  if (req.user) {
    res.redirect('back');
    return;
  }
  var userParams = req.body.user;
  if (!userParams.email || !userParams.password) {
    req.flash('info', "Please fill in all of the fields before signing up.");
    var locals = {};
    if (req.session) {
      locals.flash = req.session.flash;
    }
    res.render('auth/sign_up', locals);
    return;
  }
  
  User.findOne({ email: userParams.email }, function (err, user) {
    console.log("U: " + user);
    if (user) {
      req.flash('info', "That email is already in use. Please sign in.");
      var locals = {};
      if (req.session) {
        locals.flash = req.session.flash;
      }
      res.render('auth/sign_in', locals);
      return;
    }
    
    User.findOrCreate(req.body.user, function (err, user) {
      if (err) {
        console.error("ERR " + err);
      }
      req.login(user, function (err) {
        if (err) {
          console.error("ERR " + err);
        }

        res.redirect('/');
      });
    });
  });
};