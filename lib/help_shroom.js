var Grid = require('../models/grid'),
  User = require('../models/user'),
  _ = require('underscore');
  
var HelpShroom = {
  canCreateGrid: function (userId, cb) {
    User.findById(userId).populate('grids').exec(function (err, user) {
      if (err) { return cb(err); }
      
      var grids = user.grids || [];
      var incompleteGrids = _.filter(user.grids, function (grid) {
        var len = grid.powerUps ? grid.powerUps.length : 0;
        return len < grid.size;
      });
      
      if (user.promo.zed || user.isPremium || incompleteGrids.length <= 1) {
        return cb(null, true);
      } else {
        return cb(null, false);
      }
    });
  }
}

module.exports = HelpShroom;
