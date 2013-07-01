var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
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
      name: { type: String }
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

gridSchema.plugin(timestamps);

gridSchema.pre('save', function (next) {  
  if (!this.slug) {
    var slug = encodeURIComponent(this.name).replace(/%20/g, "-");
    var grid = this;
    Grid.count({ name:this.name }, function (err, count) {
      if (count == 0) {
        grid.slug = slug;
      } else {
        grid.slug = slug + "-" + count;
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