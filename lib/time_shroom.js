/* TimeShroom: sets up socket.io events. */

var PowerUp = require('../models/power_up'),
  Grid = require('../models/grid');
  
TimeShroom = {
  setupEvents: function (io) {
    io.sockets.on('connection', function (socket) {
      socket.on('Grid.PowerUp', function (data) {
        var powerUp = new PowerUp(data.PowerUp);
        powerUp.save(function (err, powerUp) {
          Grid.findById(powerUp.grid, function (err, grid) {
            grid.powerUps.push(powerUp._id);
            grid.save(function (err) {
              if (err) { console.log("ERR: " + err); }
            });
          });
        });
      });
    });
  }
}

module.exports = TimeShroom
