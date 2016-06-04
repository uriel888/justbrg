import express from "express"
import passport from "passport"
import * as master from "../configs/master.json"
import User from "../models/users.js"
let router = express.Router()


export const enableOPTION = (req, res, next) => {
  if(req.method == "OPTION"){
    return res.end({Status:"Ok"});
  }
  return next();
}
