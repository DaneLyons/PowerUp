/* WarpShroom: sets up the routes. */
var page = require('../routes/page'),
  grid = require('../routes/grid'),
  passport = require('passport');

exports.setupRoutes = function (app) {
  /* WARNING: order matters. Most specific route first, root last. */
  
  app.get('/grids/new', grid.gridNew);
  app.post('/grids/:slug/powerup', grid.powerUp);
  app.get('/grids/:slug/edit', grid.gridEdit);
  app.post('/grids/:slug', grid.gridUpdate);
  app.get('/grids/:slug', grid.gridShow);
  
  app.get('/grid', page.grid);
  app.post('/grids', grid.gridCreate);
  app.get('/grids', grid.gridIndex);
  app.get('/', page.home);
};
