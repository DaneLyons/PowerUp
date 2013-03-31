var Grid = require('../models/grid'),
  User = require('../models/user'),
  inflect = require('i')();

exports.home = function (req, res) {
  User.count({},function(err,count){
    var freebies = 500-count;
    if(freebies<0){ freebies=0 }
    freebies += ""; //makes freebies a string
    res.render("page/home.ejs", {
      "freebies":freebies,
      "stylesheets":["home"],
      "javascripts":["home"]
    });
  });
}

exports.grid = function (req, res) {
  res.render("page/grid.ejs", {
    "stylesheets":["grid"],
    "javascripts":["grid"]
  });
}

exports.gettingStarted = function (req, res) {
  res.render("page/getting-started.ejs", {
    "title":"Getting Started with PowerUp",
    "stylesheets":["page","start"],
    "javascripts":["slides"]
  });
}

exports.contact = function (req, res) {
  res.render("page/contact.ejs", {
    "title":"PowerUp Contact Page",
    "stylesheets":["page"]
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
  
  var workUnitNum = parseInt(workUnit, 10);
  workUnit = workUnit.trim();
  if (workUnitNum === NaN) {
    workUnit = "1 " + inflect.singularize(workUnit);
  }
  gridParams.workUnit = workUnit;
  
  var grid = new Grid(gridParams);

  if (userParams) {
    User.findOrCreate(userParams, function (err, user) {
      User.findById(user._id, function (err, user) {
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
}
