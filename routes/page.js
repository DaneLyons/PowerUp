exports.home = function (req, res) {
  res.render("page/home.ejs", {
    "title":"home",
    "stylesheets":["home"]
  });
}