var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var app = express();
var router = express.Router();

// node mysql
var http = require('http'); 
// node mysql
var mysql = require('mysql');
var connection  = require('express-myconnection'); 


// view engine setup
app.set('port', process.env.PORT || 4300);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// set connection 
app.use(
    
    connection(mysql,{
        
      host     : 'localhost', //'db566290755.db.1and1.com',
      user     : 'root', //'dbo566290755',
      //socketPath: 'mysql-socket-path',
      password : 'root',//'mypass',//'505932qq',
      port : 8889, //port mysql
      database : 'test'//'db566290755'
    },'request')
);
// error handlers
app.use(function(req,res,next){
    next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//app.get('/', routes.home());//route index, Welcoming 
//app.get('/classement/:mail/:score', routes.get_rank());//route get user's rank

app.use(router);
app.use('/', routes);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;
//var server = app.listen(80);