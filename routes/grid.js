var Grid = require('../models/grid'),
  User = require('../models/user'),
  Mailer = require('../lib/mailer'),
  async = require('async'),
  _ = require('underscore'),
  inflect = require('i')();

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
    .populate('collaborators')
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
  console.error(req.user);
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

exports.gridCreateCollaborators = function (req, res) {
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    if (err) { console.error("ERR: " + err); }
    
    var collab = req.body.collaborators.split(',');
    for (var i = 0; i < collab.length; i++) {
      collab[i] = collab[i].trim();
    }

    async.each(collab, function (email) {
      var user = new User({
        email: email,
        isConfirmed: false
      });

      user.save(function (err, user) {
        if (err) { console.error("ERR: " + err); }
        console.error("SAVED");
        var gridUrl = "http://powerup.io/grids/" + grid.slug;
        var emailText = "Hi there, \
\
You've been invited to the \"" + grid.name + "\" grid on PowerUp.io! Click the following link to get started: " + gridUrl + "\
\
- PowerUp Team";
        Mailer.send({
          to: user.email,
          subject: "You're invited to a grid on PowerUp.io.",
          text: emailText
        }, function (err) {
          if (err) { console.error("ERR: " + err); }
          console.error("SENT");
        });
      });
    }, function (err) {
      if (err) { console.error("ERR: " + err); }
      res.redirect("back");
    });
  });
};

exports.gridDestroy = function (req, res) {
  
};

exports.powerUp = function (req, res) {
  
};

