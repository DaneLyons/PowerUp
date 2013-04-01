/* WarpShroom: sets up the routes. */
var page = require('../routes/page'),
  grid = require('../routes/grid'),
  auth = require('../routes/auth'),
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
  
  app.get('/sign_up', auth.signUp);
  app.post('/sign_up', auth.postSignUp);
  app.get('/sign_in', auth.signIn);
  app.post('/sign_in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign_in',
    failureFlash: "Invalid email or password. Please try again."
  }));
  app.get('/sign_out', function (req, res) {
    req.logout();
    res.redirect('/sign_up');
  })
  
  app.get('/', page.home);
  app.get('/getting-started', page.gettingStarted);
  app.post('/start', page.start);
  app.get('/contact', page.contact);
  app.get('/faq', page.faq);
  app.get('/press', page.press);
};
