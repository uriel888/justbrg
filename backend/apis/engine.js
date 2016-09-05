import express from "express"
import passport from "passport"
import moment from "moment"
import * as master from "../configs/master.json"
import Count from "../models/count.js"
import * as countryConverter from "../tools/countryConverter.json"
import * as stateConverter from "../tools/stateConverter.json"
import {
  encrypt,
  decrypt
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
  if (!req.body.checkin) {
    return res.status(500).json({message:"checkin Wrong"});
  } else if (!req.body.checkout) {
    return res.status(500).json({message:"checkout Wrong"});
  } else if (!req.body.city) {
    return res.status(500).json({message:"city Wrong"});
  } else if (!req.body.country) {
    return res.status(500).json({message:"country Wrong"});
  } else if (!req.body.source) {
    return res.status(500).json({message:"source Wrong"});
  }


  let country = countryConverter[req.body.country.toLowerCase()];
  let state = ""
  if (!country) {
    return res.status(500).json({message:"country Wrong"});
  }

  if (country == 'us') {
    if (!req.body.state) {
      return res.status(500).json({message:"state Wrong"});
    }
    state = stateConverter[req.body.state.toLowerCase()];
  }

  if (!state && country == 'us') {
    return res.status(500).json({message:"state Wrong"});
  }


  let arrivalDate = req.body.checkin;
  let departureDate = req.body.checkout;

  let arrivalMoment = moment(arrivalDate, "MM/DD/YYYY")
  let departureMoment = moment(departureDate, "MM/DD/YYYY")
  if (!arrivalMoment.isValid() || !departureMoment.isValid()) {
    return res.status(500).json({message:"Time Wrong"});
  }
  let city = req.body.city.replace(' ', '+');
  let source = req.body.source.toLowerCase();
  let brand = ""
  if (source == 'spg') {
    if (country != '') {
      brand = 'spg';
      source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?localeCode=en_US&city=" + city + "&stateCode=" + state + "&countryCode=" + country + "&searchType=location&hotelName=&" + "currencyCode=USD&arrivalDate=" + arrivalDate + "&departureDate=" + departureDate + "&numberOfRooms=1&numberOfAdults=1&numberOfChildren=0&iataNumber=";
    } else {
      source = "http://www.starwoodhotels.com/preferredguest/search/results/grid.html?departureDate=" + departureDate + "&searchType=&complexSearchField=" + city + "&propertyIds=&arrivalDate=" + arrivalDate + "&localeCode=en_US&numberOfRooms=1&numberOfAdults=1&skinCode=SPG&iATANumber=&numberOfChildren=0&currencyCode=USD"
    }
  }else if(source == 'marriott' && country != ''){
      brand = 'marriott'
      source = `{"offset":0,"location":{"country":"${country}","region":"${state}","city":"${city}"},"endDate":"${departureMoment.format("YYYY-MM-DD")}","startDate":"${arrivalMoment.format("YYYY-MM-DD")}","sort":[{"order":"ascending","attribute":"distance"}],"limit":99 ,"rooms":[{"index":1,"guests":1,"rateTypes":["standard","PKG","M11","M12"]}]}`;
  } else {
    source = ''
  }

  if (source == '') {
    return res.status(500).json({message:'Wrong source'});
  }



  Count.findOneAndUpdate({ username: req.user.local.username }, { $inc: { search_count: 1 }},  {upsert:true}, function(err, result){
        if(err){
            console.log(err);
        }
        // console.log("RESULT: " + result);
    });
  res.json({message:(encrypt(source) + `?checkin=${arrivalMoment.format("YYYY-MM-DD")}&checkout=${departureMoment.format("YYYY-MM-DD")}&city=${req.body.city}&brand=${brand}`)});
});

module.exports = router;
