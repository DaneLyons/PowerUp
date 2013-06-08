/* TimeShroom: sets up socket.io events. */

var PowerUp = require('../models/power_up');

var TimeShroom = {
  io: null,
  setupEvents: function (io) {
    this.io = io;
    io.sockets.on('connection', function (socket) {
      socket.on('Grid.PowerUp', function (data) {
        var powerUp = new PowerUp(data.PowerUp);
        powerUp.save(function (err, powerUp) {
          if (err) { console.log(err); }
        });
      });
    });
  }
};

module.exports = TimeShroom;
