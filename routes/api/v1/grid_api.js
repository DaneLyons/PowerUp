var Grid = require('../../../models/grid'),
  User = require('../../../models/user');
  
exports.gridIndex = function (req, res) {
  if (req.user) {
    Grid.find({ user: req.user._id }).populate('user')
      .populate('collaborators')
      .populate('powerUps')
      .populate('gridButtons')
      .exec(function (err, grids) {
        if (err) {
          res.send(400, { error_message: err });
          return;
        }
        res.send({ grids: grids });
      }
    );
  } else {
    Grid.find({ isPrivate: false }, function (err, grids) {
      if (err) {
        res.send(400, { error_message: err });
        return;
      }
      res.send({ grids: grids });
    });
  }
};

exports.gridShow = function (req, res) {
  Grid.findById(req.params.id).populate('user')
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons').exec(function (err, grid) {
      if (err) {
        res.send(400, { error_message: err });
        return;
      }
      res.send({ grid: grid });
    }
  );
}
