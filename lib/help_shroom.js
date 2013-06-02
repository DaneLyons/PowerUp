var Grid = require('../models/grid'),
  User = require('../models/user');
  
var HelpShroom = {
  canCreateGrid: function (userId, cb) {
    User.findById(userId, function (err, user) {
      if (err) { return cb(err); }
      
      if (user.promo.zed || user.grids.length === 0 || user.stripeId) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  }
}