"use strict";
let fs = require('fs');
let async = require('async');
const Browser = require('zombie');
const outputFilename = './MARRIOTTCONVERTER.json'

let regions = [
  "http://www.marriott.com/hotel-search/central-america.hotels",
  "http://www.marriott.com/hotel-search/united-states.hotels",
  "http://www.marriott.com/hotel-search/africa.hotels",
  "http://www.marriott.com/hotel-search/asia.hotels",
  "http://www.marriott.com/hotel-search/australia-and-pacific-islands.hotels",
  "http://www.marriott.com/hotel-search/canada.hotels",
  "http://www.marriott.com/hotel-search/caribbean.hotels",
  "http://www.marriott.com/hotel-search/europe.hotels",
  "http://www.marriott.com/hotel-search/mexico.hotels",
  "http://www.marriott.com/hotel-search/middle-east.hotels",
  "http://www.marriott.com/hotel-search/south-america.hotels"
];
let hotels = {}
let user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20';

let browser = new Browser({
  userAgent: user_agent
});

let stop = false;

function timeout(region, done, index) {
  let url = region + `.page${index}`;
  console.log(url);
  browser.visit(url, function(e) {
    if (browser.text().indexOf('Your selection is unavailable in country or region you entered. Try again using new search terms.') >= 0) {
      stop = true;

    } else {
      let properties = browser.document.getElementsByClassName('m-result-hotel-title')
      for (let property = 0; property < properties.length; property++) {
        let hotel = properties[property].textContent.trim();
        hotels[hotel] = {
          "target": "TOADDTARGET"
        }
      }
    }
    done();
  });
}


async.eachLimit(regions, 1, function(region, done) {
  stop = false
  let count = 1;
  async.whilst(
    function() {
      return !stop;
    },
    function(done) {
      // timeout(region, done, count++);

      setTimeout(timeout, 2500, region, done, count++);
    },
    function(err, n) {
      console.log(region + " : Finished!");
      done();
      // 5 seconds have passed, n = 5
    }
  );
}, function(err) {
  if (err) {
    console.log(err);
  } else {
    fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
    })
    console.log('Processing complete');
  };
});
