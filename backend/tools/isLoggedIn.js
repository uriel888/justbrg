import express from "express"
import passport from "passport"
import * as master from "../configs/master.json"
import User from "../models/users.js"
let router = express.Router()


export const isLoggedIn = (req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.status(401).send("unauthorized");
}
