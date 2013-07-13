var Grid = require('../../../models/grid'),
  User = require('../../../models/user'),
  async = require('async');
  
exports.listGrids = function (req, res) {
  if (req.user) {
    Grid.find({ user: req.user._id }).populate('user')
      .populate('collaborators')
      .populate('powerUps')
      .populate('gridButtons')
      .exec(function (err, grids) {
        if (err) {
          return res.send(400, { error_message: err });
        }
        
        async.map(grids, function filterParams(grid, done) {
          for (prop in grid) {
            if (Grid.attrReadable.indexOf(prop) === -1) {
              delete grid[prop];
            }
          }
        }, function (err, grids) {
          res.send({ grids: grids });
        });
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

exports.createGrid = function (req, res) {
  var gridParams = req.body.grid;
  if (!gridParams) { return res.send(400, "'grid' parameter is missing."); }
  for (prop in gridParams) {
    if (Grid.attrWritable.indexOf(prop) === -1) {
      delete gridParams[prop];
    }
  }
  
  var grid = new Grid(gridParams);
  grid.save(function (err, grid) {
    if (err) { return res.send(400, err); }
    
    res.send(grid);
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
      
      for (prop in grid) {
        if (Grid.attrReadable.indexOf(prop) === -1) {
          delete grid[prop];
        }
      }
      
      res.send({ grid: grid });
    }
  );
}

exports.updateGrid = function (req, res) {
  Grid.findById(req.params.id).populate('user')
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons').exec(function (err, grid) {
      var gridParams = req.body.grid;
      
      for (prop in gridParams) {
        if (Grid.attrWritable.indexOf(prop) !== -1) {
          grid[prop] = gridParams[prop];
        }
      }
      
      grid.save(function (err, grid) {
        if (err) { return res.send(400, err); }
        
        res.send(grid);
      });
    }
  );
};

exports.deleteGrid = function (req, res) {
  Grid.remove({
    _id: req.params.id, user: req.params.user
  }, function (err, grid) {
    if (err) { return res.send(400, err); }
    res.send(grid);
  });
};
