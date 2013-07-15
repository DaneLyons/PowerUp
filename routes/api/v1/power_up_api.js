var PowerUp = require('../../../models/power_up'),
  User = require('../../../models/user');

exports.listPowerUps = function (req, res) {
  var params = req.body.powerUps;
  if (!params) { params = {}; }
  params.user = req.user._id;
  PowerUp.filterAttr(params, 'readable');
  
  PowerUp.find(params)
    .populate('user')
    .populate('grid')
    .exec(function (err, powerUps) {
      for (var i = 0; i < powerUps.length; i++) {
        powerUps[i] = powerUps[i].filterAttr('readable');
      }
      
      if (err) { return res.send(400, err); }
      res.send({ powerUps: powerUps });
    }
  );
};

exports.createPowerUp = function (req, res) {
  var params = req.body.powerUp;
  if (!params) { return res.send(400, "Missing 'powerUp' parameter."); }
  params = PowerUp.filterAttr(params, 'writable');
  params.user = req.user._id;
  
  var powerUp = new PowerUp(params);
  powerUp.save(function (err, powerUp) {
    if (err) { return res.send(400, err); }
    res.send({ powerUp: powerUp });
  });
};

exports.showPowerUp = function (req, res) {
  PowerUp.findOne({ _id: req.params.id, user: req.user._id })
    .populate('user')
    .populate('grid')
    .exec(function (err, powerUp) {
      if (err) { return res.send(400, err); }
      
      res.send({ powerUp: powerUp });
    }
  );
};

exports.updatePowerUp = function (req, res) {
  PowerUp.findOne({ _id: req.params.id, user: req.user._id })
    .populate('user')
    .populate('grid')
    .exec(function (err, powerUp) {
      if (!req.body.powerUp) { return res.send(304, powerUp); }
      var params = PowerUp.filterAttr(req.body.powerUp, 'writeable');
      for (prop in params) {
        powerUp[prop] = params[prop];
      }
      powerUp.save(function (err, powerUp) {
        if (err) { return res.send(400, err); }
        res.send({ powerUp: powerUp });
      });
    }
  );
};

exports.deletePowerUp = function (req, res) {
  PowerUp.remove({
    _id: req.params.id, user: req.params.user
  }, function (err, powerUp) {
    if (err) { return res.send(400, err); }
    res.send({ powerUp: powerUp });
  });
};
