var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;
  
var gridSchema = new Schema({
  name: String,
  workUnit: String,
  stats: {
    powerUps: Number
  },
  powerUps: [ { type: Schema.ObjectId, ref: 'PowerUp' } ],
  user: { type: Schema.ObjectId, ref: 'User' },
  public: { type: Boolean, default: false },
  slug: String
});

gridSchema.plugin(timestamps);

gridSchema.pre('save', function (next) {  
  if (!this.slug) {
    var slug = encodeURIComponent(this.name).replace(/%20/g, "-");
    console.log(slug);
    var grid = this;
    Grid.count({ slug: slug }, function (err, count) {
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

var Grid = mongoose.model('Grid', gridSchema);
module.exports = Grid;