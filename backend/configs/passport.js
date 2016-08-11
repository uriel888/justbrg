import {
  Strategy as LocalStrategy
} from "passport-local";
import User from "../models/users.js"

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });


  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //Passport strategy for local signup
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, done) => {
      process.nextTick(() => {
        User.findOne({
          'local.username': username
        }, (err, user) => {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, false, {
              message: 'That username is already taken.'
            });
          } else {
            var newUser = new User();
            newUser.local.username = username;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    }));

  //Passport strategy for local login
  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, username, password, done) {
      User.findOne({
        'local.username': username
      }, function(err, user) {

        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, {
            message: "Wrong username/password"
          });
        }

        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Wrong username/password"
          });
        }

        return done(null, user);
      });

    }));

};
