/* TimeShroom: sets up socket.io events. */

TimeShroom = {
  setupEvents: function (io) {
    io.sockets.on('connection', function (socket) {
      socket.on('grid.powerup', function (data) {
        
      });
    });
  }
}

module.exports = TimeShroom
