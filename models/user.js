var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  Grid = require('./grid'),
  bcrypt = require('bcrypt');
  
var userSchema = new Schema({
  name: String,
  email: String,
  passwordHash: String,
  passwordSalt: String,
  grids: [ { type: Schema.ObjectId, ref: 'User' } ]
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


var User = mongoose.model('User', userSchema);
module.exports = User;