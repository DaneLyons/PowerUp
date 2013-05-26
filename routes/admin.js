var User = require('../models/user');

exports.userIndex = function (req, res) {
  User.find(function (err, users) {
    res.render('admin/user_index.ejs', { users: users });
  });
}