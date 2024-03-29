var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
var gridButtonSchema = new Schema({
  grid: { type: Schema.ObjectId, ref: 'Grid' },
  workUnit: String,
  increment: { type: Number, default: 1 }
}, {
  safe: true
});

gridButtonSchema.pre('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  
  next();
});

gridButtonSchema.statics.findOrCreate = function (opts, done) {
  GridButton.findOne(opts, function (err, btn) {
    if (!btn) {
      btn = new GridButton(opts);
      btn.save(function (err) {
        if (err) {
          return done(err);
        }
        
        return done(null, btn);
      });
    } else {
      return done(null, btn);
    }
  });
};

var GridButton = mongoose.model('GridButton', gridButtonSchema);
module.exports = GridButton;