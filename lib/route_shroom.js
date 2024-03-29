/* RouteShroom: sets up the routes. */
var page = require('../routes/page'),
  grid = require('../routes/grid'),
  track = require('../routes/track'),
  powerUp = require('../routes/power_up'),
  user = require('../routes/user'),
  auth = require('../routes/auth'),
  admin = require('../routes/admin'),
  invite = require('../routes/invite'),
  gridApi = require('../routes/api/v1/grid_api'),
  powerUpApi = require('../routes/api/v1/power_up_api'),
  authApi = require('../routes/api/v1/auth_api'),
  passport = require('passport');
  
// libraries that execute code. no var needed.
require('express-namespace');

exports.setupRoutes = function (app) {  
  app.get('/grids/new', grid.gridNew);
  app.post('/grids/:slug/powerup', grid.powerUp);
  app.post('/grids/:slug/collaborators', grid.gridCreateCollaborators);
  app.post('/grids/:slug/collaborators/delete', grid.deleteCollaborator);
  app.get('/grids/:slug/edit', grid.gridEdit);
  app.post('/grids/:slug', grid.gridUpdate);
  app.get('/grids/:slug', grid.gridShow);
  app.post('/grids/:slug/delete', grid.gridDelete);
  
  app.get('/grid', page.grid);
  app.post('/grids', grid.gridCreate);
  app.get('/grids', grid.gridIndex);
  
  app.get('/track/new', track.trackNew);
  app.get('/track/record', track.record); 
  app.get('/timeline', track.timeline);

  app.post('/powerups/:id/data', powerUp.addData);
  app.delete('/powerups/:id', powerUp.deletePowerUp);

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
  app.post('/invites/:id/delete', invite.deleteInvite);
  
  app.get('/', page.home);
  app.get('/getting-started/:type', page.gettingStarted);
  app.get('/getting-started', page.gettingStarted);
  app.get('/new', page.newGrid);
  app.post('/start', page.start);
  app.get('/contact', page.contact);
  app.get('/pricing', page.pricing);
  app.get('/faq', page.faq);
  app.get('/press', page.press);
  app.get('/tos', page.tos);

  app.get('/settings', user.settings);
  app.post('/settings', user.update);
  app.get('/change_password', user.password);
  app.post('/change_password', user.updatePassword);
  app.get('/forgot_password', user.forgotPassword);
  app.post('/forgot_password', user.postForgotPassword);
  app.get('/reset_password', user.resetPassword);
  app.get('/join', user.join);
  app.post('/join', user.postJoin);
  app.get('/card', user.card);
  app.post('/card', user.postCard);
  app.get('/upgrade', user.upgrade);
  app.get('/downgrade', user.downgrade);
  
  app.get('/switchboard', page.switchboard);
  app.get('/badge_timeline', page.badgeTimeline);
  app.get('/calculator/book', page.calcBook);
  app.get('/generator/band_names', page.bandNames);
  app.get('/generator/rock_band_names', page.rockBandNames);
  app.get('/generator/company_names', page.companyNames);
  app.get('/games/fiften', page.fiften);
  app.get('/games/fiften_track', page.fiftenTrack);
  app.get('/run-400', page.run400);
  app.get('/sketch-400', page.sketch400);
  app.get('/band_signup', page.bandSignup);
  app.get('/zelda', page.zeldaEgg);
  app.get('/admin/users', admin.userIndex);
  app.get('/p/weight_loss', page.weightLoss);
  app.get('/p/become_a_writer', page.becomeAWriter);
  
  app.all('/api/*', passport.authenticate('basic', { session: false }));  
  app.namespace('/api/v1', function () {
    app.post('/auth/sign_in', authApi.signIn);
    app.post('/auth/sign_up', authApi.signUp);
    
    app.get('/grids', gridApi.listGrids);
    app.post('/grids', gridApi.createGrid);
    app.get('/grids/:id', gridApi.showGrid);
    app.put('/grids/:id', gridApi.updateGrid);
    app.delete('/grids/:id', gridApi.deleteGrid);

    app.get('/power_ups', powerUpApi.listPowerUps);
    app.post('/power_ups', powerUpApi.createPowerUp);
    app.get('/power_ups/:id', powerUpApi.showPowerUp);
    app.put('/power_ups/:id', powerUpApi.updatePowerUp);
    app.delete('/power_ups/:id', powerUpApi.deletePowerUp);
  });
};
