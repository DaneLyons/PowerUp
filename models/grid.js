var mongoose = require('mongoose'),
  inflect = require('i')(),
  util = require('util'),
  Schema = mongoose.Schema;
  
var gridSchema = new Schema({
  name: String,
  about: String,
  workUnit: String,
  stats: {
    powerUps: Number
  },
  dataTypes: [
    {
      dataType: { type: String },
      name: { type: String, required: true }
    }
  ],
  powerUps: [ { type: Schema.ObjectId, ref: 'PowerUp' } ],
  gridButtons: [ { type: Schema.ObjectId, ref: 'GridButton' } ],
  user: { type: Schema.ObjectId, ref: 'User' },
  isPrivate: { type: Boolean, default: false },
  collaborators: [ { type: Schema.ObjectId, ref: 'User' } ],
  public: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  slug: String,
  size: { type: Number, default: 400 },
  tags: [ { type: String } ]
}, {
  safe: true
});

gridSchema.statics.attrWriteable = [
  'name', 'about', 'dataTypes', 'gridButtons', 'isPrivate', 'collaborators',
  'powerUps'
];

gridSchema.statics.attrReadable = [
  'id', 'name', 'about', 'dataTypes', 'gridButtons', 'user',
  'isPrivate', 'collaborators', 'slug', 'size', 'powerUps'
];

gridSchema.methods.filterAttr = function filterAttr(filterType) {
  var model = this;
  var filterMap = {
    "readable": "attrReadable",
    "writeable": "attrWriteable"
  };
  
  var filterSet = Grid[filterMap[filterType]];
  if (typeof filterSet === 'undefined') { return model; }
  
  var props = model.toJSON();
  for (prop in props) {
    if (filterSet.indexOf(prop) === -1) {
      delete props[prop];
    }
  }
  return props;
};

gridSchema.statics.filterAttr = function (attr, filterType) {
  filterAttr.bind(attr, filterType);
};

gridSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  
  next();
});

gridSchema.pre('save', function (next) {  
  var grid = this;
  if (!grid.slug) {
    var name = grid.name.replace(/\s{2,}/g, ' ');
    name = name.replace(/\s/g, '-');
    var slug = encodeURIComponent(name);
    
    Grid.find({ slug: { $regex: slug } }, function (err, existingGrids) {
      if (err) { return next(err); }
      
      if (existingGrids.length === 0) {
        grid.slug = slug;
      } else if (existingGrids.length === 1) {
        grid.slug = slug + '-2';
      } else {
        var lastSlug = existingGrids[existingGrids.length - 1].slug;
        var parts = lastSlug.split('-');
        var lastNum = parseInt(parts[parts.length - 1], 10);
        grid.slug = slug + '-' + (lastNum + 1);
      }
      
      next();
    });
  
  } else {
    next();
  }
});

gridSchema.post('save', function (grid) {
  if (grid.gridButtons.length === 0) {
    Grid.findById(grid._id, function (err, grid) {
      var workUnit = inflect.singularize(grid.workUnit.replace(/\d/g, ''))
        .trim();
      var firstBtn = new GridButton({
        grid: grid._id,
        workUnit: workUnit,
        increment: 1
      });
      
      firstBtn.save(function (err, button) {
        grid.gridButtons.push(button._id);
        grid.save(function (err) {
          if (err) { console.log("ERR: " + err);}
        });
      });
    });
  }
});

var Grid = mongoose.model('Grid', gridSchema);
module.exports = Grid;