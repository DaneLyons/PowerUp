var Grid = require('../models/grid'),
  GridButton = require('../models/grid_button'),
  User = require('../models/user'),
  inflect = require('i')();
  
exports.settings = function (req, res) {
  res.render("user/settings.ejs", {
    "title":"PowerUp Settings",
    "stylesheets":["page","settings"]
  });
}