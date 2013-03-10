/* WarpShroom: sets up the routes. */
var page = require('../routes/page'),
  grid = require('../routes/grid'),
  passport = require('passport');

exports.setupRoutes = function (app) {
  app.get('/', page.home);
  app.get('/grid', page.grid);
  app.get('/grids', grid.index);
  app.get('/grids/:slug', grid.show);
  app.get('/grids/new', grid.new);
  app.post('/grids', grid.create);
  app.get('/grids/:slug/edit', grid.edit);
  app.post('/grids/:slug', grid.update);
  app.post('/grids/:slug/powerup', grid.powerUp);
};
