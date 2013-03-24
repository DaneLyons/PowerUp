exports.home = function (req, res) {
  res.render("page/home.ejs", {
    "stylesheets":["home"],
    "javascripts":["home"]
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
    "stylesheets":["page"]
  });
}