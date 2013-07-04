var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Grid = require('./grid'),
  Schema = mongoose.Schema;
  
var powerUpSchema = new Schema({
  position: Number,
  color: String,
  grid: { type: Schema.ObjectId, ref: 'PowerUp' },
  user: { type: Schema.ObjectId, ref: 'User' },
  data: {
      name: String,
      value: Schema.Types.Mixed
  }
}, {
  safe: true
});

powerUpSchema.plugin(timestamps);

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