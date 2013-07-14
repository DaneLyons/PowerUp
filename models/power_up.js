var mongoose = require('mongoose'),
  Grid = require('./grid'),
  Schema = mongoose.Schema;
  
var powerUpSchema = new Schema({
  position: Number,
  color: String,
  grid: { type: Schema.ObjectId, ref: 'PowerUp' },
  user: { type: Schema.ObjectId, ref: 'User' },
  metadata: Schema.Types.Mixed,
  createdAt: Date
}, {
  safe: true
});

powerUpSchema.statics.attrReadable = [
  "id", "position", "color", "grid", "user", "metadata", "createdAt"
];

powerUpSchema.statics.attrWriteable = [
  "position", "color", "grid", "metadata", "createdAt"
];

powerUpSchema.methods.filterAttr = function filterAttr(filterType) {
  var model = this;
  var filterMap = {
    "readable": "attrReadable",
    "writeable": "attrWriteable"
  };
  
  var filterSet = PowerUp[filterMap[filterType]];
  if (typeof filterSet === 'undefined') { return model; }
  
  var props = model.toJSON();
  for (prop in props) {
    if (filterSet.indexOf(prop) === -1) {
      delete props[prop];
    }
  }
  return props;
};

powerUpSchema.statics.filterAttr = function (attr, filterType) {
  filterAttr.bind(attr, filterType);
};


powerUpSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  
  next();
});

powerUpSchema.pre('save', function (next) {
  var powerUp = this;
  if (!powerUp.user) {
    Grid.findById(powerUp.grid, function (err, grid) {
      if (!grid) { next(); return; }
      powerUp.user = grid.user;
      next();
    });
  } else {
    next();
  }
});

var PowerUp = mongoose.model('PowerUp', powerUpSchema);
module.exports = PowerUp;