var Grid = require('../models/grid'),
    GridButton = require('../models/grid_button'),
    User = require('../models/user'),
    HelpShroom = require('../lib/help_shroom');

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
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  HelpShroom.canCreateGrid(req.user._id, function (err, allowed) {
    if (!allowed) {
      res.redirect('/join');
      return;
    }
    
    res.render('grid/new',{
      "stylesheets":["page","settings","auth","start"],
      "javascripts":["slides"]
    });
  });
};

exports.gridShow = function (req, res) {
  Grid.findOne({ slug: req.params.slug })
    .populate('user')
    .populate('powerUps')
    .populate('gridButtons')
  .exec(
    function (err, grid) {
      if (!grid) { res.redirect('/'); return; }
      
      if (grid.isPrivate) {
        if (!req.user || (grid.user._id !== req.user._id)) {
          res.redirect('/');
          return;
        }
      }
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
    res.redirect('/');
    return;
  }
  
  HelpShroom.canCreateGrid(req.user._id, function (err, allowed) {
    if (!allowed) {
      res.redirect('/join');
      return;
    }

    var grid = new Grid(req.body.grid);
    grid.user = req.user._id;
    grid.save(function (err, grid) {
      if (err) {
        req.flash("error", err);
        res.redirect('back');
      } else {
        res.redirect('/grids/' + grid.slug);
      }
    });
  });
};

exports.gridUpdate = function (req, res) {
  var workUnit = req.body.workUnit;
  
  Grid.findOne({ slug: req.params.slug,user: res.locals.currentUser._id })
  .populate('user')
  .populate('gridButtons')
  .exec(
    function (err, grid) {
      grid.name = req.body.grid.name;
      grid.workUnit = workUnit;
    
      var btn = GridButton.find({grid: grid._id});
      btn.exec(function(err,button){
        for(var i=0;i<workUnit.length;i++){
          if(button[i]){
            button[i].workUnit = workUnit[i];
            button[i].save();
          }else{
            var newBtn = new GridButton({
              grid: grid._id,
              workUnit: workUnit[i],
              increment: 1
            });
          
            newBtn.save(function (err, newButton) {
              grid.gridButtons.push(newButton._id);
              grid.save(function (err) {
                if (err) { console.log("ERR: " + err);}
              });
            });
          }
        }
      });
    
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

