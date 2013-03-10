/* WarpShroom: sets up the routes. */
var page = require('../routes/page'),
  grid = require('../routes/grid'),
  passport = require('passport');

exports.setupRoutes = function (app) {
  app.get('/', page.home);
  app.get('/grid', page.grid);
  app.get('/grids', grids.index);
  app.get('/grids/:slug', grids.show);
  app.get('/grids/new', grids.new);
  app.post('/grids', grids.create);
  app.get('/grids/:slug/edit', grids.edit);
  app.post('/grids/:slug', grids.update);
  app.post('/grids/:slug/powerup', grids.powerUp);
};
