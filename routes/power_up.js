var PowerUp = require('../models/power_up'),
  util = require('util');

exports.addData = function (req, res) {
  if (!req.user) { return res.redirect('back'); }
  
  PowerUp.findOne({
    _id: req.params.id,
    user: req.user._id
  }, function (err, powerUp) {
    if (err) { console.log(err); return res.send(400, err); }
    if (!powerUp) { return res.send(404); }

    var data = req.body;
    if (!data) { console.log(req.body); return res.send(400, powerUp); }
    
    if (!powerUp.metadata) {
      powerUp.metadata = data; 
    } else {
      for (prop in data) {
        powerUp.metadata[prop] = data[prop];
      }
    }
    
    powerUp.markModified('metadata');
    console.log(util.inspect(powerUp, false, null));
    powerUp.save(function (err, powerUp) {
      console.log(util.inspect(powerUp, false, null));
      if (err) { console.log(err); return res.send(400, err); }
      res.send(powerUp);
    });
  });
};

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
