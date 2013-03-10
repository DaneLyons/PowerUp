
/**
 * Module dependencies.
 */

var express = require('express'),
  http = require('http'),
  mongoose = require('mongoose'),
  redis = require('redis'),
  RedisStore = require('connect-redis')(express),
  path = require('path'),
  PowerShroom = require('./lib/power_shroom'),
  WarpShroom = require('./lib/warp_shroom');

var app = express();
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/powerup';
mongoose.connect(dbUri);

PowerShroom.setupPassport();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  
  if (process.env.NODE_ENV === 'production') {
    var redisUrl = url.parse(process.env.REDISTOGO_URL),
      redisAuth = redisUrl.auth.split(':'),
      redisHost = redisUrl.hostname,
      redisPort = redisUrl.port,
      redisDb = redisAuth[0],
      redisPass = redisAuth[1];
    
    app.use(express.session({
      secret: process.env.CLIENT_SECRET || "it's a secret to everybody...",
      cookie: { maxAge: 999999999, httpOnly: false },
      store: new RedisStore({
        host: redisHost,
        port: redisPort,
        db: redisDb,
        pass: redisPass
      })
    }));
  } else {
    app.use(express.session());
  }
  
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

WarpShroom.setupRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
