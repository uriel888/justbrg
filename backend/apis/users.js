import express from "express"
import passport from "passport"
import * as master from "../configs/master.json"
import User from "../models/users.js"
import isEmail from 'validator/lib/isEmail'
let router = express.Router()


const isLoggedIn = (req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.status(401).end();
}

if (master.Status == "dev") {
  router.get(`/test${master.Status}`, (req, res) => {
    res.end("GOOD TEST");
  });

  router.get('/', isLoggedIn, (req, res) => {
    res.send(req.user);
  });
}

router.post('/register', (req, res) => {
  if(!isEmail(req.body.username)){
    return res.status(500).send({message:"Not a valid email address"})
  }
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(400).send(info);
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return res.status(500).send(loginErr);
      }
      return res.json({Status:"Ok"})
    });
  })(req, res);
});



router.post('/login', (req, res) => {
  if(!isEmail(req.body.username)){
    return res.status(500).send({message:"Not a valid email address"})
  }
  passport.authenticate('local-login', function(err, user, info) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return res.status(500).send(loginErr);
      }
      res.json({Status:"Ok"})
    });
  })(req, res);
});


router.get('/logout', isLoggedIn, (req, res) => {
  req.logout()
  res.json({Status:"Ok"})
});


module.exports = router;
