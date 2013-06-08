/* WarpShroom: sets up the routes. */
var page = require('../routes/page'),
  grid = require('../routes/grid'),
  user = require('../routes/user'),
  auth = require('../routes/auth'),
  invite = require('../routes/invite'),
  passport = require('passport');

exports.setupRoutes = function (app) {  
  app.get('/grids/new', grid.gridNew);
  app.post('/grids/:slug/powerup', grid.powerUp);
  app.post('/grids/:slug/collaborators', grid.gridCreateCollaborators);
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
    res.redirect('/');
  });
  app.get('/invites/:id', invite.showInvite);
  app.post('/invites/:id/accept', invite.acceptInvite);
  
  app.get('/', page.home);
  app.get('/getting-started', page.gettingStarted);
  app.get('/settings', user.settings);
  app.post('/settings', user.update);
  app.get('/change_password', user.password);
  app.post('/change_password', user.updatePassword);
  app.post('/start', page.start);
  app.get('/contact', page.contact);
  app.get('/faq', page.faq);
  app.get('/press', page.press);
  app.get('/tos', page.tos);
  app.get('/switchboard', page.switchboard);
  app.get('/badge_timeline', page.badgeTimeline);
};
