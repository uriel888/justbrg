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

//import apis
import users from "./apis/users.js"
import search from "./apis/engine.js"
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
console.log(`Connect to DB: ${db_config.address}/${master.App}_${master.Status}`);
mongoose.connect(`${db_config.address}/${master.App}_${master.Status}`);
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
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
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
app.use(session({
  secret: `${master.secret.sesson_secret}`
}));
app.use(passport.initialize());
app.use(passport.session());

//apis for users
app.use('/users', users);
app.use(isLoggedIn);
app.use('/search', search);

app.listen(port);
console.log(`Server ${master.Status} is listening on ${port}`);
