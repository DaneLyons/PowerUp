var Grid = require('../models/grid'),
  GridButton = require('../models/grid_button'),
  User = require('../models/user'),
  inflect = require('i')();
  
exports.settings = function (req, res) {
  if (typeof req.user === 'undefined') {
    res.redirect('/');
    return;
  }
  User.findById(req.user._id, function (err, user) {
    res.render("user/settings.ejs", {
      "title":"PowerUp Settings",
      "stylesheets":["page","settings"],
      "user":user
    });
  });
}