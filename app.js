if (process.env.NODE_ENV === 'production') {
  require('nodetime').profile({
    accountKey: '702d10982845b0a8f28426ca17ce63de4587ef31', 
    appName: 'PowerUp'
  });
}

/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  redis = require('redis'),
  MongoStore = require('connect-mongo')(express),
  page = require('./routes/page'),
  RouteShroom = require('./lib/route_shroom'),  // Routes
  path = require('path'),
  url = require('url'),
  util = require('util'),
  AuthShroom = require('./lib/auth_shroom'),
  RouteShroom = require('./lib/route_shroom'),
  EventShroom = require('./lib/event_shroom');

var app = express();
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/powerup';
mongoose.connect(dbUri);

AuthShroom.setupPassport();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.session({
      secret: process.env.CLIENT_SECRET || "it's a secret to everybody...",
      cookie: { maxAge: 999999999, httpOnly: false },
      store: new MongoStore({
        url: process.env.MONGO_SESSION_URL
      })
    }));
  } else {
    app.use(express.session());
  }
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  
  app.use(function (req, res, next) {
    res.locals.currentUser = req.user || req.session.passport.user;
    next();
  });
  
  app.use(function (req, res, next) {
    if (req.session.flash) {
      res.locals.flash = req.session.flash;
    }
    next();
  });
  
  app.use(function (req, res, next) {
    if (req.path.match(/^\/admin\//)) {
      if (!req.user || !req.user.email.match(/^admin\@powerup\.io$/)) {
        res.redirect('/');
      }
    }
    next();
  });
  
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

RouteShroom.setupRoutes(app);

var server = http.createServer(app)
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
EventShroom.setupEvents(io);
