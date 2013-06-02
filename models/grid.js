var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  inflect = require('i')(),
  Schema = mongoose.Schema,
  GridButton = require('./grid_button');
  
var gridSchema = new Schema({
  name: String,
  workUnit: String,
  stats: {
    powerUps: Number
  },
  powerUps: [ { type: Schema.ObjectId, ref: 'PowerUp' } ],
  gridButtons: [ { type: Schema.ObjectId, ref: 'GridButton' }],
  user: { type: Schema.ObjectId, ref: 'User' },
  collaborators: [ { type: Schema.ObjectId, ref: 'User' } ],
  public: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  slug: String,
  size: { type: Number, default: 400 }
}, {
  safe: true
});

gridSchema.plugin(timestamps);

gridSchema.pre('save', function (next) {  
  if (!this.slug) {
    var slug = encodeURIComponent(this.name).replace(/%20/g, "-");
    console.log("GRID SLUG: "+slug);
    var grid = this;
    Grid.count({ name:this.name }, function (err, count) {
      console.log("GRID COUNT: "+count);
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