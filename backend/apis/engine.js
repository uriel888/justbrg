import express from "express"
import passport from "passport"
import * as master from "../configs/master.json"
import User from "../models/users.js"
import * as convert from "../tools/countryConverter.json"


let router = express.Router()

if (master.Status == "dev") {
  router.get(`/test${master.Status}`, (req, res) => {
    res.end("GOOD TEST");
  });

  router.get('/', (req, res) => {
    res.send(req.user);
  });
}


router.post('/', (req, res) => {
  //Date format: mm/dd/yyyy
  if (!req.query.checkin) {
    return res.status(500).send("checkin Wrong");
  } else if (!req.query.checkout) {
    return res.status(500).send("checkout Wrong");
  } else if (!req.query.city) {
    return res.status(500).send("city Wrong");
  } else if (!req.query.country) {
    return res.status(500).send("country Wrong");
  } else if (!req.query.source) {
    return res.status(500).send("source Wrong");
  }


  let country = convert[req.query.country.toLowerCase()];
  res.end(country);


});

module.exports = router;
