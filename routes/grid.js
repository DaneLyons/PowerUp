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
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    res.render('grid/show', { grid: grid });
  });
};

exports.gridEdit = function (req, res) {
  
};

exports.gridCreate = function (req, res) {
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

