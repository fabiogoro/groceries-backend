require('dotenv').config()
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let DAL = require('./DAL/DAL')
var passwordResetHelper = require('./util/passwordResetHelper')


async function DALMiddleware(req, res, next){
  req.DAL = DAL
  next()
}

async function passwordResetMiddleware(req, res, next){
  req.passwordResetHelper = passwordResetHelper
  next()
}

function corsMiddleware(req, res, next) {
    res.append('Access-Control-Allow-Origin', ['http://localhost:3001']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Credentials', 'true');
    next();
}



var indexRouter = require('./routes/index');
var orderRouter = require('./routes/order');
var userRouter = require('./routes/user');
var usersRouter = require('./routes/users');
var groceryRouter = require('./routes/grocery');
var groceriesRouter = require('./routes/groceries');
var categoriesRouter = require('./routes/categories');
var cartRouter = require('./routes/cart');
var loginRouter = require('./routes/login');
var logoffRouter = require('./routes/logoff');
var resetRouter = require('./routes/reset');

var app = express();

app.use(session({
  resave: false, 
  saveUninitialized: false, 
  secret: process.env.SESSION_SECRET,
  cookie: {domain: 'localhost'}
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(DALMiddleware)
app.use(passwordResetMiddleware)
app.use(corsMiddleware)

app.use('/', indexRouter);
app.use('/order', orderRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/grocery', groceryRouter);
app.use('/groceries', groceriesRouter);
app.use('/categories', categoriesRouter);
app.use('/carts?', cartRouter);
app.use('/login', loginRouter);
app.use('/reset', resetRouter);
app.use('/logoff', logoffRouter);

module.exports = app;
