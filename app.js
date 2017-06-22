var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);

var mongoose = require("./db/db");
var router = require('./routes/router');
var Intercept =  require('./service/common/interceptservice');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/img/icon/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {index: false}));

app.use(session({
    secret: 'aws-blog',
    name: 'aws-blog',
    saveUninitialized: false, // don't create session until something stored
    resave: false,//don't save session if unmodified
    unset: 'destroy',//The session will be destroyed (deleted) when the response ends.
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

// 登陆拦截，暂不使用
// app.use(Intercept);

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
