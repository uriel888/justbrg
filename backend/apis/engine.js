import express from "express"
import passport from "passport"
import * as master from "../configs/master.json"
import User from "../models/users.js"
import * as countryConverter from "../tools/countryConverter.json"
import * as stateConverter from "../tools/stateConverter.json"
import {
  encrypt, decrypt
} from "../tools/crypt.js"

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


  let country = countryConverter[req.query.country.toLowerCase()];
  let state = ""
  if (!country) {
    return res.status(500).send("country Wrong");
  }

  if (country == 'us') {
    if (!req.query.state) {
      return res.status(500).send("state Wrong");
    }
    state = stateConverter[req.query.state.toLowerCase()];
  }

  if (!state && country == 'us') {
    return res.status(500).send("state Wrong");
  }


  let arrivalDate = req.query.checkin;
  let departureDate = req.query.checkout;
  let city = req.query.city.replace(' ', '+');
  let source = req.query.source;
  if (source == 'spg') {
    if (country != '') {
      source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?localeCode=en_US&city=" + city + "&stateCode=" + state + "&countryCode=" + country + "&searchType=location&hotelName=&" + "currencyCode=USD&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate + "&numberOfRooms=1&numberOfAdults=1&numberOfChildren=0&iataNumber=";
    } else {
      source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?departureDate=" + departureDate + "&searchType=&complexSearchField=" + city + "&propertyIds=&arrivalDate=" + arrivalDate + "&localeCode=en_US&numberOfRooms=1&numberOfAdults=1&skinCode=SPG&iATANumber=&numberOfChildren=0&currencyCode=USD"
    }
  } else {
    source = ''
  }

  if (source == '') {
    return res.status(500).end('Wrong source');
  }
  res.end((encrypt(source)+`?checkin=${req.query.checkin}&checkout=${req.query.checkou}&city=${req.query.city}`));
});

module.exports = router;
