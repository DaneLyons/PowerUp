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

powerUpSchema.pre('save', function (next) {
  if (!this.createdAt) {
    if (this.updatedAt) {
      this.createdAt = this.updatedAt;
    } else {
      this.createdAt = new Date();
    }
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