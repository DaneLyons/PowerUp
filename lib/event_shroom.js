/* EventShroom: sets up socket.io events. */

var PowerUp = require('../models/power_up'),
  Grid = require('../models/grid');

var EventShroom = {
  io: null,
  setupEvents: function (io) {
    this.io = io;
    io.sockets.on('connection', function (socket) {
      socket.on('Grid.PowerUp', function (data) {
        var powerUp = new PowerUp(data.PowerUp);
        powerUp.save(function (err, powerUp) {
          Grid.findOne({ _id: powerUp.grid }, function (err, grid) {
            grid.powerUps.push(powerUp._id);
            grid.save(function (err) {
              if (err) { console.log("ERR: " + err); }
              io.sockets.in(grid._id).emit('Grid.PowerUp.Created',
                { power_up: powerUp.toJSON() });
            });
          });
        });
      });
      
      socket.on('Grid.Join', function (data) {
        var gridId = data.gridId,
          userId = data.userId;
          
        var gridId = gridId;
        socket.set(gridId, gridId, function () {
          socket.join(gridId);
          io.sockets.in(gridId).emit('Grid.Joined', { userId: userId });
        });
      });
    });
  }
};

module.exports = EventShroom;
