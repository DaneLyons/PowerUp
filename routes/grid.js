var Grid = require('../models/grid');

exports.gridIndex = function (req, res) {
  Grid.find({ public: true })
    .populate('user')
    .populate('powerUps')
    .exec(function (err, grids) {
      res.render('grid/index', { grids: grids })
    }
  );
};

exports.gridNew = function (req, res) {
  res.render('grid/new');
};

exports.gridShow = function (req, res) {
  Grid.findOne({ slug: req.params.slug })
    .populate('user')
    .populate('powerUps')
  .exec(
    function (err, grid) {
      var workUnitNum = parseInt(10, grid.workUnit),
        workUnitName = grid.workUnit.split(' ')[-1],
        powerUps = [];
      
      for (var i = 1; i <= 3; i++) {
        powerUps.push(workUnitNum * i);
      }
      res.render('grid/show', { grid: grid, powerUps: powerUps });
    }
  );
};

exports.gridEdit = function (req, res) {
  
};

exports.gridCreate = function (req, res) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  
  var grid = new Grid(req.body.grid);
  grid.save(function (err, grid) {
    if (err) {
      req.flash(err);
      res.redirect('back');
    } else {
      res.redirect('/grids/' + grid.slug);
    }
  })
};

exports.gridUpdate = function (req, res) {
  
};

exports.gridDestroy = function (req, res) {
  
};

exports.powerUp = function (req, res) {
  
};

