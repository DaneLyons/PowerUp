exports.index = function (req, res) {
  Grid.find({ public: true })
    .populate('user')
    .populate('powerUps')
    .exec(function (err, grids) {
      res.render('grid/index', { grids: grids })
    }
  );
};

exports.new = function (req, res) {
  res.render('grid/new');
};

exports.show = function (req, res) {
  Grid.findOne({ slug: req.params.slug }, function (err, grid) {
    res.render('grid/show', { grid: grid });
  });
};

exports.edit = function (req, res) {
  
};

exports.create = function (req, res) {
  
};

exports.update = function (req, res) {
  
};

exports.destroy = function (req, res) {
  
};

exports.powerUp = function (req, res) {
  
};

