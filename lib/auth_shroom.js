/* AuthShroom: sets up Passport authentication. */

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/user');

exports.setupPassport = function () {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      // NOTE: username is really their email. Passport is picky w/ names.
      User.findOne({ "email": username }, function(err, user) {
        if (err) {
          console.error("ERR: " + err);
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }

        user.validPassword(password, function (err, valid) {
          console.error("ERR: " + err);
          if (!valid) {
            return done(null, false, { message: 'Incorrect password.' });
          } else {
            return done(null, user);
          }  
        });
      });
    }
  ));
  
  passport.use(new BasicStrategy(
    function(id, secret, done) {
      User.findById(id, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.secret !== secret) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
  
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ "_id": id }, function(err, user) {
      done(err, user);
    });
  });
};
