var User = require('../../../models/user');

exports.signIn = function (req, res) {
  var userParams = req.body.user;
  if (!userParams) {
    return res.send(400, "You must include a 'user' parameter.");
  }
  
  User.findOne({ email: userParams.email }, function (err, user) {
    if (err) { return res.send(400, err); }
    
    if (!user) { return res.send(400, "That email is not in use."); }
    if (!user.validPassword(userParams.password)) {
      return res.send(400, "Invalid password");
    }
    return res.send({ user: user._id, pass: user.secret });
  });
};

exports.signUp = function (req, res) {
  var userParams = req.body.user;
  if (!userParams) {
    return res.send(400, "You must include a 'user' parameter.");
  }
  
  User.findOne({ email: userParams.email }, function (err, user) {
    if (err) { return res.send(400, err); }
    if (user && user.passwordHash) {
      return res.send(400, "That email is already in use. Please sign in.");
    }
    
    User.findOrCreate(req.body.user, function (err, user) {
      if (err) {
        return res.send(400, err);
      }
      
      return res.send({ user: user._id, pass: user.secret });
    });
  });
};