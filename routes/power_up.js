var PowerUp = require('../models/power_up');

exports.deletePowerUp = function (req, res) {
  if (!req.user) { return res.redirect('back'); }
  
  PowerUp.findOne({
    _id: req.params.id,
    user: req.user._id 
  }, function (err, powerUp) {
    if (err) { console.log(err); return res.send(400, err); }
    powerUp.remove(function (err, powerUp) {
      if (err) { console.log(err); return res.send(400, err); }
      res.send(powerUp);
    });
  });
};
