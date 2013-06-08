var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  inflect = require('i')(),
  Schema = mongoose.Schema,
  GridButton = require('./grid_button'),
  PowerUp = require('./power_up'),
  User = require('./user');
  
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

gridSchema.methods.getCollaboratorStats = function (cb) {
  var grid = this;
  var collaborators = {};
  
  User.findById(grid.user, function (err, user) {
    if (err) { return cb(err); }
    User.find({ _id: { $in: grid.collaborators } }, function (err, users) {
      if (err) { return cb(err); }
      users.push(user);
      for (var i = 0; i < users.length; i++) {
        user = users[i];
        collaborators[user.email] = {};
      }
      
      PowerUp.find({ grid: grid._id })
        .populate('user')
        .exec(function (err, powerUps) {
          for (var i = 0; i < powerUps.length; i++) {
            var powerUp = powerUps[i];
            if (!collaborators[powerUp.user.email][powerUp.color]) {
              collaborators[powerUp.user.email][powerUp.color] = 0;
            }
            collaborators[powerUp.user.email][powerUp.color] += 1;
          }
          return cb(null, collaborators);
        }
      );
    });
  });
};

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