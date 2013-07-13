var PowerUp = require('../../../models/power_up'),
  User = require('../../../models/user');

exports.listPowerUps = function (req, res) {
  
};

exports.createPowerUp = function (req, res) {
  
};

exports.showPowerUp = function (req, res) {
  PowerUp.findOne({ _id: req.params.id, user: req.user._id })
    .populate('user')
    .exec(function (err, powerUp) {
      if (err) { return res.send(400, err); }
      
      res.send(powerUp);
    }
  );
};

exports.updatePowerUp = function (req, res) {
  
};

exports.deletePowerUp = function (req, res) {
  
};
