var mongoose = require('mongoose'),
  Grid = require('./grid'),
  _ = require('underscore'),
  Schema = mongoose.Schema;
  
// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true  

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

function filterAttr(attr, filterType) {
  var filterMap = {
    "readable": "attrReadable",
    "writeable": "attrWriteable"
  };
  
  var filterSet = PowerUp[filterMap[filterType]];
  if (typeof filterSet === 'undefined') { return attr; }
  
  var props = {};
  for (prop in attr) {
    if (filterSet.indexOf(prop) !== -1) {
      props[_.underscored(prop)] = attr[prop];
    }
  }
  return props;
};

powerUpSchema.static('filterAttr', function (attr, filterType) {
  return filterAttr(attr, filterType);
});

powerUpSchema.method('filterAttr', function (filterType) {
  return filterAttr(this, filterType);
});

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