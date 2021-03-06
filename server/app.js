//module inclusions / requirements / dependencies
let express = require('express');
let path = require('path'); // part of node.js core
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require("express-session");


// define routers
let index = require('./routes/index'); // top level routes
let users = require('./routes/users');
let member = require('./routes/members');
var employer = require('./routes/employer');
let jobs = require('./routes/jobs');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

//setup session
app.use(session({
secret: "SomeSecret",
saveUninitialized: true,
resave: true
}));

// route redirects
app.use('/', index);
app.use('/users',users);
app.use('/member',member);
app.use('/jobs',jobs);
app.use('/employer',employer);



module.exports = app;
