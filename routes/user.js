var Grid = require('../models/grid'),
  GridButton = require('../models/grid_button'),
  User = require('../models/user'),
  Preference = require('../models/preference'),
  Mailer = require('../lib/mailer'),
  inflect = require('i')(),
  uuid = require('node-uuid'),
  stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
  
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
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  res.render('user/join', {
    "title":"Do more with PowerUp PRO!",
    "stylesheets":["page","settings","auth", "join"]
  });
};

exports.postJoin = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  User.findById(req.user._id, function (err, user) {
    stripe.customers.create({
      email: user.email,
      card: req.body.stripeToken,
      plan: "powerup_premium"
    }, function(err, customer) {
          if (err) {
             console.log(err.message);
          }
          user.stripeId = customer.id;
          user.cardType = customer.active_card.type;
          user.cardLast4 = customer.active_card.last4;
          user.isPremium = true;
          
          user.save(function (err, user) {
            req.flash("success", "Thank you! Welcome to PowerUp Premium.");
            res.redirect('/grids');
          });
       }
     );
  });
};

exports.card = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  res.render('user/card', {
    "stylesheets":["page","settings","auth", "join"]
  });
};

exports.postCard = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  User.findById(req.user._id, function (err, user) {
    stripe.customers.update(user.stripeId, { card: req.body.stripeToken },
       function(err, customer) {
          if (err) {
             console.log(err.message);
          }
          user.stripeId = customer.id;
          user.cardType = customer.active_card.type;
          user.cardLast4 = customer.active_card.last4;
          user.isPremium = true;
          
          user.save(function (err, user) {
            req.flash("success", "Thanks! Your card has been updated.");
            res.redirect('/grids');
          });
       }
     );
  });
};

exports.downgrade = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  User.findById(req.user._id, function (err, user) {
    stripe.customers.cancel_subscription(user.stripeId, false, function (err) {
      user.isPremium = false;
      user.save(function (err) {
        req.flash("success", "Your account has been downgraded.");
        res.redirect('back');
      });
    });
  });
};

exports.upgrade = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  User.findById(req.user._id, function (err, user) {
    if (!user.stripeId) {
      res.redirect('/join');
      return;
    }
    
    stripe.customers.update_subscription(user.stripeId, {
        plan: "powerup_premium"
      }, function (err) {
        user.isPremium = true;
        user.save(function (err) {
          req.flash("success", "Your account has been upgraded!");
          res.redirect('back');
        });
      }
    );
  });
};

exports.forgotPassword = function (req, res) {
  res.render('user/forgot_password', {
    "stylesheets":["page","settings","auth"]
  });
};

exports.postForgotPassword = function (req, res) {
  var email = req.body.email;
  if (!email) {
    req.flash("info", "Please enter your email.");
    return res.redirect('back');
  }
  
  User.findOne({ email: email }, function (err, user) {
    if (err || !user) {
      req.flash("error", "Sorry, but we couldn't find anyone with that email.");
      return res.redirect('back');
    }
    
    if (!user.resetToken) {
      user.resetToken = uuid.v4();
      user.save(function (err) {
        if (err) { console.log(err); }
      });
    }
    
    var link = "https://powerup.io/reset_password?u=" + user._id + "&t=" + user.resetToken;
    var msg = "<p>Hi there,</p><p>We received a request to reset your PowerUp password. If you didn't request this, you can safely ignore this. You can <a href='" + link + "'>sign in and reset your password here.</a></p><p>PowerOn!</p><p>Dane and Austin</p><br /><p>Co-Founders of PowerUp</p>";
    
    Mailer.send({
      to: email,
      subject: "Reset your PowerUp password.",
      text: msg,
      html: msg,
    }, function (err, response) {
      req.flash("info", "Thanks! You should receive a reset email shortly.");
      res.redirect('back');
    });
  });
};

exports.resetPassword = function (req, res) {
  var userId = req.query.u,
    resetToken = req.query.t;
    
  if (!userId || !resetToken) {
    return res.redirect('/');
  }
  
  User.findById(userId, function (err, user) {
    if (err || !user) { return res.redirect('/'); }
    
    if (user.resetToken !== resetToken) {
      return res.redirect('/');
    }
    
    req.login(user, function (err) {
      if (err) { console.log(err); return res.redirect('/'); }
      res.redirect('/change_password');
    });
  });
};
