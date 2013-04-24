var Grid = require('../models/grid');

exports.gridIndex = function (req, res) {
  if(res.locals.currentUser){
    Grid.find({ user: res.locals.currentUser._id })
      .populate('user')
      .populate('powerUps')
      .exec(function (err, grids) {
        res.render('grid/index', {
          grids: grids,
          "stylesheets":["page","settings","auth","list"]
        });
      }
    );
  }else{
    res.redirect('/');
  }
};

exports.gridNew = function (req, res) {
  res.render('grid/new',{
    "stylesheets":["page","settings","auth","start"],
    "javascripts":["slides"]
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
  Grid.findOne({ slug: req.params.slug })
    .populate('user')
    .populate('powerUps')
    .populate('gridButtons')
  .exec(
    function (err, grid) {
      res.render('grid/edit', {
        grid: grid,
        "stylesheets":["page","settings","auth","start"]
      });
    }
  );
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
  });
};

exports.gridUpdate = function (req, res) {
  Grid.findOne({ slug: req.params.slug })
  .populate('gridButtons')
  .exec(
    function (err, grid) {
      grid.name = req.body.grid.name;
      grid.workUnit = req.body.workUnit;
      
      grid.save(function (err, grid) {
        res.redirect('/grids/' + grid.slug);
      });
    }
  );
};

exports.gridDestroy = function (req, res) {
  
};

exports.powerUp = function (req, res) {
  
};

