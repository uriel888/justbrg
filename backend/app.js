import * as master from "./configs/master.json"
import * as db_config from "./configs/db.json"
import express from 'express'
import mongoose from "mongoose"
import passport from "passport"
import morgan from "morgan"
import session from "express-session"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import {
  Strategy as LocalStrategy
} from "passport-local"
import {
  isLoggedIn
} from "./tools/isLoggedIn.js"

import {
  enableOPTION
} from "./tools/enableOPTION.js"

import connectMongo from 'connect-mongo';
let MongoStore = connectMongo(session);
//import apis
import users from "./apis/users.js"
import search from "./apis/engine.js"
import autoComplete from "./apis/autoComplete.js"
// import  users         from "./apis/compile/users.js"


//import models
import userSchema from "./models/users.js"
// import  userSchema    from  "./models/compile/users.js"



//require('./apis/compile/passport.js')(passport);
require('./configs/passport.js')(passport);

// PRINT APP DETAIL
console.log(`APP NAME: ${master.App}`)
console.log(`Version: ${master.Version}`)
console.log(`Date: ${master.Date}`)
console.log(`Author: ${master.Author}`)
console.log(`Email: ${master.Email}`)


//Initilize Connection with mongodb
console.log(`Connect to DB: ds153715.mlab.com:53715/justbrg`);
let db_options = {
  user: db_config.username,
  pass: db_config.pwd
}
// mongoose.createConnection(`mongodb://jiang181:jemit.uriel!@52.37.71.194:27017/justbrg?authSource=dbWithUserCredentials`)
// mongoose.connect(`${db_config.address}/${master.App}_${master.Status}`,db_options);
mongoose.connect(`mongodb://${db_config.username}:${db_config.pwd}@ds153715.mlab.com:53715/justbrg`);
//mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`DB Connect Success`);
});


//Initilize Server with Express
let app = express();
let port = process.env.PORT || master.dev_port;

//Enable logs on requests
console.log("Current Mode:" + master.Status);
if (master.Status === "dev") {
  app.use(morgan(`${master.Status}`));
} else {
  port = process.env.PORT || master.port
}

//Enable cookie parser
app.use(cookieParser());

//Enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

//Enable session and password
if (master.Status === "dev") {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTION');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
      next();
    });
  app.use(session({
    secret: `${master.secret.sesson_secret}`,
    store: new MongoStore(
      {mongooseConnection:mongoose.connection}
    )
  }));
} else {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', "https://justbrg.com");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTION');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
  app.use(session({
    secret: `${master.secret.sesson_secret}`,
    store: new MongoStore(
      {mongooseConnection:mongoose.connection}
    )
  }));
}
app.use(passport.initialize());
app.use(passport.session());

//apis for users
app.use(enableOPTION);
app.use('/autoComplete', autoComplete);
app.use('/users', users);
app.use(isLoggedIn);
app.use('/search', search);

app.listen(port);
console.log(`Server ${master.Status} is listening on ${port}`);
