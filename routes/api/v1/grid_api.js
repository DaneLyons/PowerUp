var Grid = require('../../../models/grid'),
  User = require('../../../models/user'),
  async = require('async');
  
exports.listGrids = function (req, res) {
  Grid.find({ user: req.user._id }).populate('user')
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons')
    .exec(function (err, grids) {
      if (err) {
        return res.send(400, { error_message: err });
      }
      
      for (var i = 0; i < grids.length; i++) {
        grids[i] = grids[i].filterAttr('readable');
      }
      res.send({ grids: grids });
    }
  );
};

exports.createGrid = function (req, res) {
  var gridParams = req.body.grid;
  if (!gridParams) { return res.send(400, "'grid' parameter is missing."); }
  gridParams = Grid.filterAttr(gridParams, 'writeable');
  
  var grid = new Grid(gridParams);
  grid.save(function (err, grid) {
    if (err) { return res.send(400, err); }
    
    res.send({ grid: grid);
  });
};

exports.showGrid = function (req, res) {
  Grid.findById(req.params.id).populate('user')
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons').exec(function (err, grid) {
      if (err) {
        res.send(400, { error_message: err });
        return;
      }
      
      grid = grid.filterAttr('readable');
      res.send({ grid: grid });
    }
  );
}

exports.updateGrid = function (req, res) {
  Grid.findById(req.params.id).populate('user')
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons').exec(function (err, grid) {
      var gridParams = Grid.filterParams(req.body.grid, 'writeable');
      for (prop in gridParams) {
        grid[prop] = gridParams[prop];
      }
      
      grid.save(function (err, grid) {
        if (err) { return res.send(400, err); }
        res.send({ grid: grid });
      });
    }
  );
};

exports.deleteGrid = function (req, res) {
  Grid.remove({
    _id: req.params.id, user: req.params.user
  }, function (err, grid) {
    if (err) { return res.send(400, err); }
    res.send({ grid: grid });
  });
};
