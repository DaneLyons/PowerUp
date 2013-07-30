var mongoose = require('mongoose'),
  uuid = require('node-uuid'),
  Schema = mongoose.Schema,
  Grid = require('./grid'),
  Action = require('./action'),
  SignUp = require('./sign_up'),
  Mailer = require('../lib/mailer')
  bcrypt = require('bcrypt'),
  EventShroom = require('../lib/event_shroom');
  
var userSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  secret: String,
  resetToken: String,
  isConfirmed: { type: Boolean, default: true },
  grids: [ { type: Schema.ObjectId, ref: 'Grid' } ],
  promo: {
    zed: Boolean
  },
  isPremium: { type: Boolean, default: false },
  stripeId: String,
  cardType: String,
  cardLast4: String
}, {
  safe: true
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  
  next();
});

userSchema.pre('save', function (next) {
  if (!this.secret) {
    this.secret = uuid.v4();
  }
  next();
});

userSchema.pre('save', function (next) {
  if (!this.resetToken) {
    this.resetToken = uuid.v4();
  }
  next();
});

userSchema.statics.bcryptPassword = function (userParams, done) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return done(err);
    }
    
    if (typeof userParams.password === 'undefined') {
      return done(null);
    }
    
    bcrypt.hash(userParams.password, salt, function (err, hash) {
      if (err) {
        return done(err);
      }
      
      var params = userParams;
      delete params.password;
      params.passwordHash = hash;
      params.passwordSalt = salt;
      return done(null, params);
    });
  });
};

userSchema.statics.findOrCreate = function(userParams, done) {
  if (userParams.id) {
    // shortcut for OAuth strategies
    User.findOne({ id: userParams.id }, function(err, user) {
      if (err) { return done(err); }

      if (!user) {
        var user = new User(userParams);
        if (userParams.picture && userParams.picture.data) {
          user.imageUrl = userParams.picture.data.url;
        } else if (userParams.photos) {
          user.imageUrl = userParams.photos[0].value;
        }
        
        user.save(function (err, user) {
          if (err) {
            return done(err);
          }

          return done(null, user);
        });
      } else {
        return done(null, user);
      }
    });
  }
  
  User.findOne({ email: userParams.email }, function(err, user) {
    if (err) { return done(err); }

    if (!user) {
      if (typeof userParams.password === 'undefined') {
        user = new User(userParams);
        user.save(function (err, user) {
          if (err) {
            return done(err);
          }

          return done(null, user);
        });
      } else {
        User.bcryptPassword(userParams, function (err, params) {
          if (err) { return done(err); }
          
          user = new User(params);
          user.save(function (err, user) {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });
        });
      } 
    } else {
      if (typeof userParams.password === 'undefined') {
        user.save(function (err, user) {
          if (err) {
            return done(err);
          }

          return done(null, user);
        });
      } else {
        user.validPassword(userParams.password, function (err, valid) {
          if (!valid) {
            return done(new Error("Invalid email or password."));
          }
          return done(null, user);
        });
      }
    }
  });
};

userSchema.methods.validPassword = function (password, done) {
  bcrypt.compare(password, this.passwordHash, function (err, res) {
    if (err) {
      console.error("ERR " + err);
      return done(err);
    }
    
    return done(null, res);
  });
};

userSchema.pre('save', function (next) {
  var user = this;
  User.count(function (err, count) {
    if (count < 500) {
      user.promo.zed = true;
      next();
    } else {
      next();
    }
  });
});

userSchema.pre('save', function (next) {
  var user = this;
  if (!user.isConfirmed && !user.confirmationToken) {
    user.confirmationToken = uuid.v4();
  } 

  next();
});

userSchema.post('save', function (user) {
  if (user.promo.zed) {
    var actionParams = {
      user: user._id,
      actionType: 'Models.User.Create',
      actionObjectId: user._id,
      actionObjectType: 'User'
    };

    Action.findOne(actionParams, function (err, action) {
      if (!action) {
        action = new Action(actionParams);
        action.save(function (err) {
          var io = EventShroom.io;
          console.log(io);

          io.sockets.emit('promo.zed', function () {
            console.log("EMISSIONS");
            user.save(function (err, user) {
              if (err) { console.log("ERR: " + err) }
            });
          });
        });
      }
    });
  }
});

userSchema.post('save', function (user) {
  var actionParams = {
    user: user._id,
    actionType: "Models.User.Confirm",
    actionObjectId: user._id,
    actionObjectType: 'User'
  };
  
  Action.findOne(actionParams, function (err, action) {
    if (!action) {
      var action = new Action(actionParams);
      action.save(function (err, action) {
        if (err) { console.log("ERR: " + err); }
        
      });
    }
  });
});

var User = mongoose.model('User', userSchema);
module.exports = User;