/* EventShroom: sets up socket.io events. */

var PowerUp = require('../models/power_up'),
  Grid = require('../models/grid');

var EventShroom = {
  io: null,
  setupEvents: function (io) {
    this.io = io;
    io.sockets.on('connection', function (socket) {
      socket.on('Grid.PowerUp', function (data) {
        console.log("#POW Socket event");
        var powerUp = new PowerUp(data.PowerUp);
        powerUp.save(function (err, powerUp) {
          Grid.findOne({ _id: powerUp.grid }, function (err, grid) {
            grid.powerUps.push(powerUp._id);
            grid.save(function (err) {
              if (err) { console.log("ERR: " + err); }
            });
          });
        });
      });
    });
  }
};

module.exports = EventShroom;
