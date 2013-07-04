var Grid = require('../models/grid'),
  GridButton = require('../models/grid_button'),
  User = require('../models/user'),
  HelpShroom = require('../lib/help_shroom'),
  inflect = require('i')(),
  async = require('async'),
  util = require('util');

exports.home = function (req, res) {
  User.count({},function(err,count){
    var freebies = 500-count;
    if(freebies<0){ freebies=0 }
    freebies += ""; //makes freebies a string
    if(freebies.length<2){
      freebies = "00"+freebies;
    }else if(freebies.length<3){
      freebies = "0"+freebies;
    }
    res.render("page/home.ejs", {
      "freebies":freebies,
      "stylesheets":["home"],
      "javascripts":["home"]
    });
  });
};

exports.tos = function (req, res) {
  res.render("page/tos.ejs", {
    "title": "PowerUp Terms of Service",
    "stylesheets":["page","content"]
  });
};

exports.switchboard = function (req, res) {
  res.render("page/switchboard.ejs", {
    "title": "PowerUp Switchboard",
    "stylesheets":["page","content","switchboard"]
  });
}

exports.grid = function (req, res) {
  res.render("page/grid.ejs", {
    "stylesheets":["grid"],
    "javascripts":["grid"]
  });
};

exports.gettingStarted = function (req, res) {
  var renderParams = {
    "type": req.params.type || false,
    "title": "Getting Started with PowerUp",
    "stylesheets": ["page","start"],
    "javascripts": ["slides"]
  };
  
  if (req.user) {
    HelpShroom.canCreateGrid(req.user._id, function (err, allowed) {
      if (!allowed) {
        res.redirect('/join');
        return;
      }
  
      res.render("page/getting-started.ejs", renderParams);
    });
  } else {
    res.render("page/getting-started.ejs", renderParams);
  }
};

exports.contact = function (req, res) {
  res.render("page/contact.ejs", {
    "title":"PowerUp Contact Page",
    "stylesheets":["page","content"]
  });
};

exports.faq = function (req, res) {
  res.render("page/faq.ejs", {
    "title":"PowerUp Frequently Asked Questions",
    "stylesheets":["page","content"]
  });
};

exports.press = function (req, res) {
  res.render("page/press.ejs", {
    "title":"PowerUp Press Inquiries",
    "stylesheets":["page","content"]
  });
};

exports.badgeTimeline = function (req, res) {
  res.render("page/badge-timeline.ejs", {
    "title":"PowerUp Badge Timeline",
    "stylesheets":["page","content","timeline"]
  });
};

exports.calcBook = function (req, res) {
  res.render("page/calc-book.ejs", {
    "title":"How long does it take to write a book?",
    "stylesheets":["page","content"],
    "javascripts":["modernizr"]
  });
};

exports.bandNames = function (req, res) {
  res.render("page/band-names.ejs", {
    "title":"Random Band Name Generator",
    "stylesheets":["page","content"],
    "javascripts":["modernizr"]
  });
}

exports.fiften = function (req, res) {
  res.render("page/fiften.ejs", {
    "title":"FIFTEN - Game to improve your mental fortitude.",
    "stylesheets":["page","content"],
    "javascripts":["modernizr"]
  });
}

exports.fiftenTrack = function (req, res) {
  res.render("page/fiften_track.ejs", {
    "title":"FIFTEN - Game to improve your mental fortitude.",
    "stylesheets": ["page","start"],
    "javascripts": ["slides"]
  });
}

exports.run400 = function (req, res) {
  res.render("page/run-400.ejs", {
    "title":"Run 400 Miles Using PowerUp",
    "stylesheets":["home","landing"],
    "javascripts":["home"]
  });
}

exports.sketch400 = function (req, res) {
  res.render("page/sketch-400.ejs", {
    "title":"Create 400 Sketches Using PowerUp",
    "stylesheets": ["home","landing"],
    "javascripts": ["home"]
  });
}

exports.start = function (req, res) {
  var userParams = req.body.user,
    gridParams = req.body.grid,
    workUnit = req.body.workUnit;
    
  if (!userParams && !req.user) {
    req.flash("Please tell us your email and password.");
    res.redirect('back');
    return;
  }
  
  if (!gridParams) {
    req.flash("Please tell us your goal.");
    res.redirect('back');
    return;
  }
  
  if (!workUnit) {
    req.flash("Please tell us 1 step towards your goal.");
    res.redirect('back');
    return;
  }
  gridParams.workUnit = workUnit;
  
  
  var grid = new Grid(gridParams);
  async.map(workUnit, function (unit, done) {
    var btn = new GridButton({
      grid: grid._id,
      workUnit: unit,
      increment: 1
    });
  
    btn.save(function (err, button) {
      if (err) { return done(err); }
      grid.gridButtons.push(button._id);
      grid.save(function (err) {
        if (err) { console.log("ERR: " + err); return done(err); }
        return done(null, button);
      });
    });
  }, function (err, gridButtons) {
    if (err) { console.log(err); }

    if (userParams) {
      User.findOrCreate(userParams, function (err, user) {
        if (err) {
          console.error("ERR " + err);
        }

        User.findById(user._id, function (err, user) {
          grid.user = user._id;
          grid.save(function (err, grid) {
            if (err) { console.log(err); }
            user.grids.push(grid._id);
            user.save(function (err) {
              if (err) { console.log("ERR: " + err); }
              req.login(user, function (err) {
                if (err) {
                  console.error("ERR " + err);
                }
                res.redirect("/grids/" + grid.slug);
                return;
              });
            });
          });
        });
      });
    } else {
      User.findById(req.user._id, function (err, user) {
        grid.user = user._id;
        grid.save(function (err, grid) {
          user.grids.push(grid._id);
          user.save(function (err) {
            if (err) { console.log("ERR: " + err); }
            res.redirect("/grids/" + grid.slug);
            return;
          });
        });
      });
    }
  });
};
