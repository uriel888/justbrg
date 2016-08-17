import express from "express"
import passport from "passport"
import * as master from "../configs/master.json"
import User from "../models/users.js"
import {
  isLoggedIn
} from "../tools/isLoggedIn.js"

let router = express.Router()

function isEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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

router.post('/verify', isLoggedIn, (req, res) => {
  res.json({username: req.user.local.username});
});


router.post('/logout', isLoggedIn, (req, res) => {
  req.logout()
  if(req.session){
    req.session.destroy()
  }
  res.json({Status:"Ok"});
});


module.exports = router;
