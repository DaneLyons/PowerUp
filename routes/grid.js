var Grid = require('../models/grid');

exports.gridIndex = function (req, res) {
  if(res.locals.currentUser){
    Grid.find({ user: res.locals.currentUser._id })
      .populate('user')
      .populate('powerUps')
      .exec(function (err, grids) {
        res.render('grid/index', {
          grids: grids,
          "stylesheets":["page","settings","auth"]
        });
      }
    );
  }else{
    res.redirect('/');
  }
};

exports.gridNew = function (req, res) {
  res.render('grid/new',{
    "stylesheets":["page"]
  });
};

exports.gridShow = function (req, res) {
  Grid.findOne({ slug: req.params.slug })
    .populate('user')
    .populate('powerUps')
    .populate('gridButtons')
  .exec(
    function (err, grid) {
      res.render('grid/show', {
        grid: grid,
        "stylesheets":["grid"]
      });
    }
  );
};

exports.gridEdit = function (req, res) {
  
};

exports.gridCreate = function (req, res) {
  console.log(req.user);
  if (!req.user) {
    res.redirect('/sign_in');
    return;
  }
  
  var grid = new Grid(req.body.grid);
  grid.user = req.user._id;
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

