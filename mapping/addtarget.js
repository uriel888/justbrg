"use strict";

let hotels = require('./MARRIOTTCONVERTER.json')
let async = require('async')
const Browser = require('zombie')
let outputFilename = './MARRIOTTCONVERTER.json'
let fs = require('fs')
let url = ""
let fileName = ""
let path = ""


let browserOpts = {
  runScripts: false,
  site: 'http://www.hotelscombined.com'
};

let home = new Browser(browserOpts);

let array = [];
let count = 0;
let success = 0;
let last_success = 0;
let start = 0;
let end = 49;
let index = 0;
for (let hotel in hotels) {

  if((start<=index++) && hotels[hotel].target == 'TOADDWRONG' && hotel.indexOf('&') >= 0){
    count++;
    array.push(hotel);
  }
}

function timeout(hotel, done, index) {
  fileName = hotel.replace(/®/g,'').replace(/\./g,'').replace(/,/g,'').replace(/ /g, "_").replace(/&_/g,"").replace(/\s*-\s*/g,"_").replace(/\//g,'_').replace(/Courtyard/g,'Courtyard_by_Marriott').replace(/'/g,'').replace(/_I_.*/g,'');
  // fileName += '_A_Marriott_Luxury_Lifestyle_Hotel'
  let r = Math.floor(Math.random() * 10000000) / 10000000
  url = `http://www.hotelscombined.com/Hotel/SearchResults?checkin=2016-10-27&checkout=2016-10-28&Rooms=1&adults_1=2&fileName=${fileName}&r=${r}`
  path = `/Hotel/SearchResults?checkin=2016-07-27&checkout=2016-07-28&Rooms=1&adults_1=2&fileName=${fileName}&r=${r}`

  if(index%20 == 0 && (success - last_success) > 0){
    last_success = success;
    fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(success+"/"+count+" successfully updated!");
        console.log("JSON saved to " + outputFilename);
      }
    })
  }
  let page = new Browser(browserOpts);
  home.visit(url, function(e) {
    console.log(url);
    if (home.statusCode == 200) {
      if (home.html().indexOf('Verify Your Request') < 0) {
        success++;
        console.log((index) + "/" + count + " : " + hotel + " : " + home.statusCode);
        hotels[hotel].target = fileName
      } else {
        hotels[hotel].target = "TOADDTRAFFIC"
        console.log((index) + "/" + count + " : " + hotel + " : Traffic Insepect");
      }
    } else {
      hotels[hotel].target = "TOADDWRONG"
      console.log((index) + "/" + count + " : " + hotel + " : " + home.statusCode);
    }
    done(null)
  });
}

home.visit('/', function(e) {
  console.log(home.statusCode);
  let index = 0;
  async.eachLimit(array, 1, function(hotel, done) {
    setTimeout(timeout, 5000, hotel, done ,index++)
  }, function(err) {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log(success+"/"+count+" successfully updated!");
          console.log("JSON saved to " + outputFilename);
        }
      })
      console.log('Processing complete');
    };
  });
});
