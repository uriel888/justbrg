"use strict";
let fs = require('fs')
let outputFilename = './SPGCONVERTER.json'
let hotels = require('./SPGCONVERTER.json')
let async = require('async')
let url = require('url')
const Browser = require('zombie')

let user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20';


let array = [];
let count = 0;
let success = 0;
let index = 0;
for (let hotel in hotels) {
  if (hotels[hotel].propertyId != 'TOADDID' && (hotels[hotel].address == 'TOADDADDRESS' || hotels[hotel].geo == 'TOADDGEO' || hotels[hotel].img == 'TOADDIMG')) {
    count++;
    array.push(hotel);
  }
}


function pageLoaded(window) {
  return window.document.getElementsByClassName('property');
}

let browser = new Browser({
  userAgent: user_agent
});

function timeout(hotel, done, index) {
  if (index % 10 == 0 && index != 0) {
    fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(success + "/" + count + " successfully updated!");
      }
    })
  }
  let url = `http://www.starwoodhotels.com/sheraton/property/overview/index.html?language=en_US&propertyID=${hotels[hotel].propertyId}`
  console.log(url);
  browser.visit(url, function(e) {
    if (browser.statusCode == 200) {
      browser.wait(pageLoaded, function() {
        let address = browser.document.getElementById('propertyAddress')
          // let lat = browser.document.getElementsByName('propLat')
          // let lng = browser.document.getElementsByName('propLong')
        let property = browser.document.getElementsByClassName('property')
        let img = browser.document.getElementsByClassName('carouselImage')
        let flag = true;
        if (address) {
          hotels[hotel].address = address.textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim()
        } else {
          hotels[hotel].address = 'TOADDADDRESS'
          flag = false;
        }


        if (property) {
          if (property[0]) {
            let lng = 'null';
            let lat = 'null';
            for(let i = 0 ; i < property.length ; i++){
              let tl = property[i].getAttribute('data-longitude')
              let tt = property[i].getAttribute('data-latitude')
              if(tl != 'null' && tl != null){
                lng = tl;
                lat = tt;
                break;
              }
            }
            if (lng != 'null' && lng != null) {
              hotels[hotel].geo = {
                "lat": lat,
                "lng": lng
              }
            } else {
              flag = false;
              hotels[hotel].geo = 'TOADDGEO'
            }
          } else {
            flag = false;
            hotels[hotel].geo = 'TOADDGEO'
          }
        } else {
          flag = false;
          hotels[hotel].geo = 'TOADDGEO'
        }

        if (img) {
          if (img[0]) {
            hotels[hotel].img = img[0].getAttribute('data-backgroundimage')
          } else {
            flag = false;
            hotels[hotel].img = 'TOADDIMG'
          }
        } else {
          flag = false;
          hotels[hotel].img = 'TOADDIMG'
        }

        if (flag) {
          success++;
        }
        console.log((index) + "/" + count + " : " + hotel + " : ");
        console.log(hotels[hotel]);
        console.log('----------------------------------------');
        done(null)
      });
    } else {
      console.log((index) + "/" + count + " : " + hotel + " : FAIL");
      done(null)
    }
  });
}



async.eachLimit(array, 1, function(hotel, done) {
  setTimeout(timeout, 2500, hotel, done, index++)
}, function(err) {
  if (err) {
    fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(success + "/" + count + " successfully updated!");
        console.log("JSON saved to " + outputFilename);
      }
    })
    console.log('Processing complete');
    console.log(err);
  } else {
    fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(success + "/" + count + " successfully updated!");
        console.log("JSON saved to " + outputFilename);
      }
    })
    console.log('Processing complete');
  };
});
