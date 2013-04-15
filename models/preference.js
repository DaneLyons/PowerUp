var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var preferenceSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  twitter: String
}, {
  safe: true
});

preferenceSchema.statics.findOrCreate = function (opts, done) {
  Preference.findOne(opts, function (err, preference) {
    if (!preference) {
      preference = new Preference(opts);
      preference.save(function (err) {
        if (err) {
          return done(err);
        }
        
        return done(null, preference);
      });
    } else {
      return done(null, preference);
    }
  });
};

var Preference = mongoose.model('Preference', preferenceSchema);
module.exports = Preference;