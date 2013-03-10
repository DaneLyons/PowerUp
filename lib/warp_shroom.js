/* WarpShroom: sets up the routes. */
var page = require('../routes/page');

exports.setupRoutes = function (app) {
  app.get('/', page.home);
  app.get('/grid', page.grid);
}