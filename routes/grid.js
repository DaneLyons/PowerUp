var Grid = require('../models/grid'),
  GridButton = require('../models/grid_button'),
  User = require('../models/user'),
  HelpShroom = require('../lib/help_shroom'),
  PowerUp = require('../models/power_up'),
  Invite = require('../models/invite'),
  async = require('async'),
  _ = require('underscore'),
  util = require('util'),
  markdown = require( "markdown" ).markdown,
  inflect = require('i')();

exports.gridIndex = function (req, res) {
  if (req.user) {
    User.findById(req.user._id, function (err, user) {
      Grid.find({ _id: { $in: user.grids } })
        .populate('user')
        .populate('powerUps')
        .exec(function (err, grids) {
          res.render('grid/index', {
            grids: grids,
            "stylesheets":["page","settings","auth","list"]
          });
        }
      );
    });
  } else {
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
      res.redirect('https://powerupio.herokuapp.com/join');
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
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons')
  .exec(
    function (err, grid) {
      if (!grid) { res.redirect('/'); return; }
      
      var collab_ids = {};
      for(collaborator in grid.collaborators){
        collab_ids[grid.collaborators[collaborator]._id] = true;
      }
      if (grid.isPrivate) {
        if (!req.user) {
          res.redirect('/');
          return;
        } else if (!collab_ids[req.user._id] && grid.user._id.toString() !== req.user._id.toString()) {
          res.redirect('/');
          return;
        }
      }

      if (err) { console.log(err); }
      Invite.find({ grid: grid._id, isAccepted: false })
        .populate('toUser')
        .exec(function (err, invites) {
          if (err) { console.log(err); }
          
          var collaborators = {};
          var collabInfo = {};

          User.findById(grid.user, function (err, user) {
            if (err) { console.log(err); }
            User.find({ _id: { $in: grid.collaborators } }, function (err, users) {
              if (err) { console.log(err); }
              if (!users) { users = []; }
              users.push(user);
              for (var i = 0; i < users.length; i++) {
                user = users[i];
                collaborators[user.email] = { };
                collabInfo[user.email] = { name: user.name, id: user._id };
              }

              PowerUp.find({ grid: grid._id })
                .populate('user')
                .exec(function (err, powerUps) {
                  for (var i = 0; i < powerUps.length; i++) {
                    var powerUp = powerUps[i];
                    
                    if (!collaborators[powerUp.user.email][powerUp.color]) {
                      collaborators[powerUp.user.email][powerUp.color] = 0;
                    }
                    collaborators[powerUp.user.email][powerUp.color] += 1;
                  }

                  for (email in collaborators) {
                    var total = 0;
                    for (color in collaborators[email]) {
                      total += collaborators[email][color];
                    }
                    collaborators[email].total = total;
                  }
                  
                  var about = "";
                  if(grid.about){
                    about = grid.about;
                  }

                  res.render('grid/show', {
                    grid: grid,
                    collaborators: collaborators,
                    collabInfo: collabInfo,
                    invites: invites,
                    gridCount: user.grids.length,
                    aboutHTML: markdown.toHTML( about ),
                    "stylesheets":["grid"],
                    "javascripts":[]
                  });
                }
              );
            });
          });
        }
      );
    }
  );
};

exports.gridEdit = function (req, res) {
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  Grid.findOne({ slug: req.params.slug })
    .populate('user')
    .populate('collaborators')
    .populate('powerUps')
    .populate('gridButtons')
  .exec(
    function (err, grid) {
      Invite.find({ grid: grid._id }, function (err, invites) {
        if (!invites) { invites = []; }
        res.render('grid/edit', {
          grid: grid,
          invites: invites,
          "stylesheets":["page","settings","auth","start","grid_edit"]
        });
      });
    }
  );
};

exports.gridCreate = function (req, res) {
  console.log(req.body.grid);
  console.error(req.user);
  if (!req.user) {
    res.redirect('/');
    return;
  }
  
  HelpShroom.canCreateGrid(req.user._id, function (err, allowed) {
    if (!allowed) {
      res.redirect('https://powerupio.herokuapp.com/join');
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
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    if (req.body.grid.name) {
      
    }
    grid.name = req.body.grid.name;
    grid.isPrivate = req.body.grid.isPrivate;
    
    var dataTypes = req.body.grid.dataTypes || [];
    for (i = 0; i < dataTypes.length; i++) {
      var field = dataTypes[i];
      if (field === null || typeof field === 'undefined') {
        delete dataTypes[i];
        continue;
      } else {
        if (typeof field.name === null || typeof field.name === 'undefined' || field.name.length === 0 && !field.original_value) {
          delete dataTypes[i];
          continue;
        }
      }
      
      var exists = false;
      for (var j = 0; j < grid.dataTypes.length; j++) {
        if(field.original_value && grid.dataTypes[j].name === field.original_value){
          if(field.name.length > 0){
            grid.dataTypes[j].name = field.name;
            grid.dataTypes[j].dataType = field.dataType;
            exists = true;
            
            PowerUp.find({grid: grid._id}, function (err, powerUps) {
              async.each(powerUps, function (powerUp) {
                if (powerUp.metadata && powerUp.metadata[field.original_value]){
                  console.log('UPDATING POWERUP');
                  powerUp.metadata[field.name] = powerUp.metadata[field.original_value];
                  delete powerUp.metadata[field.original_value];
                  powerUp.save(function (err, powerUp) {
                    if (err) { console.log(err); }
                  });
                }
              });
            });
          }
        }
        if (!grid.dataTypes[j]) { continue; }
        if (!grid.dataTypes[j].name) { delete grid.dataTypes[j]; continue; }
        if (grid.dataTypes[j].name === field.name) {
          exists = true;
        }
      }
      if (!exists && field.name.length > 0) { grid.dataTypes.push(field); }
    }
    
    grid.about = req.body.grid.about.replace(/(\r\n|\n|\r)/gm," ")
      .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
      .replace(/\"/g, "&#34;")
      .replace(/\'/g, "&#39;");
    var newButtons = req.body.gridButtons;

    if (typeof newButtons !== 'undefined') {
      GridButton.find({
        _id: { $in: Object.keys(newButtons) }
      }, function (err, gridButtons) {
        async.map(gridButtons, function (button, cb) {
          button.workUnit = newButtons[button._id];
          button.save(function (err, button) {
            if (err) { return cb(err); }
            return cb(null, button);
          });
        }, function (err, buttons) {
          if (err) { console.log(err); }
        });
      });
    }

    var workUnits = req.body.workUnits;
    if (typeof workUnits !== 'undefined') {
      var btns = [];
      for (var i = 0; i < workUnits.length; i++) {
        var workUnit = workUnits[i];
        var btn = new GridButton({
          grid: grid._id,
          workUnit: workUnit,
          increment: 1
        });
        btns.push(btn);
      }

      async.map(btns, function (btn, cb) {
        btn.save(function (err, btn) {
          if (err) { return cb(err); }
          return cb(null, btn);
        });
      }, function (err, gridButtons) {
        if (err) { console.log(err); }

        for (var i = 0; i < gridButtons.length; i++) {
          grid.gridButtons.push(gridButtons[i]._id);
        }

        grid.save(function (err, grid) {
          if (err) { console.log("ERR: " + err); }
          res.redirect('/grids/' + grid.slug);
        });
      });
    } else {
      grid.save(function (err, grid) {
        if (err) { console.log(err); }
        res.redirect('/grids/' + grid.slug);
      });
    }
  });
};

exports.gridCreateCollaborators = function (req, res) {
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    if (err) { console.log("ERR: " + err); }
    
    var emails = req.body.collaborators.split(',');
    for (var i = 0; i < emails.length; i++) {
      var email = emails[i].trim();
      var invite = new Invite({
        fromUser: req.user._id,
        toParams: { email: emails[i].trim() },
        grid: grid._id
      });
      
      invite.save(function (err) {
        if (err) { console.log("ERR: " + err); }
      });
    }
    
    res.redirect("back");
  });
};

exports.deleteCollaborator = function (req, res) {
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    User.findById(req.body.user, function (err, user) {
      user.grids.remove(grid._id);
      user.save(function (err, user) {
        PowerUp.find({
          grid: grid._id,
          user: user._id
        }, function (err, powerUps) {
          var ids = _.map(powerUps, function (p) { return p._id });
          PowerUp.remove({
            grid: grid._id,
            user: user._id
          }, function (err) {
            if (err) { console.log(err); }
            for (var i = 0; i < ids.length; i++) {
              grid.powerUps.remove(ids[i]);
            }
            grid.collaborators.remove(user._id);
            grid.save(function (err, grid) {
              res.redirect("back");
            });
          });
        });
      });
    });
  });
};

exports.gridDelete = function (req, res) {
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    User.findById(req.user._id, function (err, user) {
      if (String(grid.user) !== String(user._id)) {
        req.flash("You don't have permission to delete this grid.");
        return res.redirect('back');
      }
      
      PowerUp.remove({ grid: grid._id }, function (err) {
        GridButton.remove({ grid: grid._id }, function (err) {
          Invite.remove({ grid: grid._id }, function (err) {
            user.grids.pull(grid._id);
            user.save(function (err, user) {
              Grid.remove({ _id: grid._id }, function (err) {
                req.flash("Grid deleted.");
                return res.redirect('/grids');
              });
            });
          });
        });
      });
    });
  });
};

exports.powerUp = function (req, res) {
  
};

