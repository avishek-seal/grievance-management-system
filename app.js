
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , indexRoute = require('./routes/index')
  , loginRoute = require('./routes/login')
  , signupRoute = require('./routes/signup')
  , cons = require('consolidate')
  , mongoose = require('mongoose')
  , mongoConfig = require('./gms-configuration/gms-mongodb-config.js')
  , serverConfig = require('./gms-configuration/gms-server-config.js')
  , userRest = require('./gms-rest/user-rest.js')
  , complainRest = require('./gms-rest/complain-rest.js');

mongoose.connect(mongoConfig.getURL(mongoConfig.MONGO_DEV));

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', indexRoute.index);
app.get('/login', loginRoute.login);
app.get('/gms-user-registration', signupRoute.signup);

app.post('/signin', userRest.login);
app.post('/signout', userRest.logout);
app.get('/is-authentic', userRest.isAuthentic);
app.get('/role', userRest.getRole);
app.post('/register', userRest.registration);
app.get('/profile', userRest.getProfile);
app.put('/profile', userRest.updateProfile);
app.get('/email-verification', userRest.verifyLink);
app.post('/user-complain', complainRest.create);
app.get('/user-complain', complainRest.getUsersComplain);
app.get('/complain', complainRest.getAll);
app.post('/complain-comment', complainRest.addComment);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

userRest.setAdmin(userRest.adminProfile);
