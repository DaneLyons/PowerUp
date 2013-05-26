var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  Grid = require('./grid'),
  Action = require('./action'),
  SignUp = require('./sign_up'),
  bcrypt = require('bcrypt'),
  TimeShroom = require('../lib/time_shroom');
  
var userSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  grids: [ { type: Schema.ObjectId, ref: 'User' } ],
  promo: {
    zed: Boolean
  }
}, {
  safe: true
});

userSchema.plugin(timestamps);

userSchema.statics.bcryptPassword = function (userParams, done) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return done(err);
    }
    
    if (userParams.password === undefined) {
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
    
    return;
  }
  
  User.findOne({ email: userParams.email }, function(err, user) {
    if (err) { return done(err); }

    if (!user) {
      if (userParams.password === undefined) {
        var user = new User(userParams);
        user.save(function (err, user) {
          if (err) {
            return done(err);
          }

          return done(null, user);
        });
      } else {
        User.bcryptPassword(userParams, function (err, params) {
          var user = new User(params);
          user.save(function (err, user) {
            if (err) {
              return done(err);
            }

            return done(null, user);
          });
        });
      } 
    } else {
      user.validPassword(userParams.password, function (err, valid) {
        if (!valid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
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
      User.findById(user._id, function (err, existingUser) {
        console.log("EXISTING: " + existingUser);
        if (!existingUser) {
          var msg = "Sorry, but we're not taking any more signups right now. We'll email you when we're ready!";
          user.invalidate('_id', msg);
          var signUp = new SignUp({ userData: user });
          signUp.save(function (err, signUp) {
            next(new Error(msg));
          })
        } else {
          next();
        }
      });
    }
  });
});

userSchema.post('save', function (user) {
  var actionParams = {
    user: user._id,
    actionType: 'Models.User.Create',
    actionObjectId: user._id
  };
  
  Action.findOne(actionParams, function (err, action) {
    if (!action) {
      action = new Action(actionParams);
      action.save(function (err) {
        var io = TimeShroom.io;
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
});

var User = mongoose.model('User', userSchema);
module.exports = User;