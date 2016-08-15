import express from 'express'
import passport from 'passport'
import unidecode from 'unidecode'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import https from 'https';
import fs from 'fs';
import * as master from './configs/master.json'
// import * as hotelConverter from './tools/hotelscombinedFileNameConverter.json'
import * as hotelConverter from './tools/SPGCONVERTER.json'
import Horseman from 'node-horseman'
import {
  encrypt,
  decrypt
} from './tools/crypt.js'

let options = {
  key: fs.readFileSync('./configs/justbrg.key'),
  cert: fs.readFileSync('./configs/justbrg.crt')
};

let app = express();
let port = process.env.PORT || master.dev_crawler_port;

//Enable logs on requests
if (master.Status == "dev") {
  app.use(morgan(`${master.Status}`));
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTION');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
} else {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', "https://justbrg.com");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTION');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
  port = process.env.PORT || master.port;
}

//Enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/:encode', (req, res) => {
  if (!req.query.checkin) {
    return res.status(500).send("checkin Wrong");
  } else if (!req.query.checkout) {
    return res.status(500).send("checkout Wrong");
  } else if (!req.query.city) {
    return res.status(500).send("city Wrong");
  }
  let horseman = new Horseman();
  let url = decrypt(req.params.encode);

  if (!url) {
    return res.status(500).end('Something went wrong!');
  }
  //TODO: ADD VERIFICATION
  console.log(`url: ${url}`);
  if (url.indexOf('starwoodhotels') > -1) {
    //Only for spg

    horseman
      .open(url)
      .text('.propertyInner')
      .then((text) => {
        text = text.replace(/Dates flexible\?/g, '').replace(/Find Availability/g, '').replace(/\n/g, ' ').trim().replace(/\s\s+/g, '\n').replace(/New\n/g, '').replace(/,\n/g,', ')
        let count = 0;
        let start = 0;
        let end = 0;
        for (let i = 0; i < text.length; i++) {
          if (text.charAt(i) == '{' && count == 0) {
            start = i;
            count++;
          } else if (text.charAt(i) == '{') {
            count++;
          } else if (text.charAt(i) == '}') {
            if (--count == 0) {
              end = i;
              text = text.substr(0, start) + text.substr(end + 1);
              i -= (end - start)
            }
          }
        }
        let hotels = text.split("\n\n")
        let hotel_results = []
        for (let i = 0; i < hotels.length; i++) {
          if (hotels[i].indexOf('This hotel is not currently accepting reservations.') > -1) {
            continue
          }
          let current = hotels[i].split('\n')
          let result = {}
          for (let j = 0; j < current.length; j++) {
            if (j == 0) {
              result.hotel_name = unidecode(current[j])
            } else if (current[j] == "Lowest Standard Rate") {
              if (current[++j] == "Find Available Dates") {
                continue
              }
              result.BAR = current[++j].replace(',', '').match(/\d+/)[0]
            } else if (current[j] == "SPG Free Nights") {
              if (current[++j] == "Find Available Dates" || current[j] == "Please contact us to redeem your Free Nights." || current[j] == "This hotel has Limited Participation in the Starwood Preferred Guest® Program.") {
                continue
              }
              result.FN = current[++j].replace(',', '').match(/\d+/)[0]
            } else if (current[j] == "SPG Cash & Points") {
              if (current[++j] == "Find Available Dates" || current[j] == "This hotel has Limited Participation in the Starwood Preferred Guest® Program.") {
                continue
              }
              result.CP = {
                "p": current[++j].replace(',', '').match(/\d+/)[0],
                "c": current[++j].match(/\d+/)[0]
              }
            }
          }
          //DNS SOLUTION for fetching data
          let fileName = ""

          fileName = hotelConverter[result.hotel_name]
          if(typeof fileName !== 'undefined' && fileName){
            if(fileName.propertyId != 'TOADDID'){
              result.officialURL = `http://www.starwoodhotels.com/preferredguest/rates/room.html?departureDate=${req.query.checkout}&refPage=property&ctx=search&arrivalDate=${req.query.checkin}&priceMin=&iataNumber=&iATANumber=&sortOrder=&propertyId=${fileName.propertyId}&accessible=&numberOfRooms=1&numberOfAdults=1&bedType=&priceMax=&numberOfChildren=0&nonSmoking=&currencyCode=USD`
            }
            if(fileName.geo != 'TOADDGEO' && fileName.address != 'TOADDADDRESS'){
              result.geo = fileName.geo;
              result.address = fileName.address;
              result. img = fileName.img;
            }
            fileName = fileName.target;
          }
          if(fileName == 'TOADD'){
            fileName = undefined
          }

          // if(fileName == undefined){
          //   fileName = result.hotel_name.replace(/ /g, "_").replace(/,/g, "").replace(/_-_/g, "_").replace(/\'/g,"").replace(/_&_/g, "_").replace(/\./g, "")
          // }
          let r = Math.floor(Math.random() * 10000000) / 10000000

          if (master.cors == "DNS") {
            result.targetURL = fileName==undefined?undefined:`https://hotels.justbrg.com/Hotel/SearchResults?checkin=${req.query.checkin}&checkout=${req.query.checkout}&Rooms=1&adults_1=2&fileName=${fileName}&r=${r}`
          } else {
            result.targetURL = fileName==undefined?undefined:`http://www.hotelscombined.com/Hotel/SearchResults?checkin=${req.query.checkin}&checkout=${req.query.checkout}&Rooms=1&adults_1=2&fileName=${fileName}&r=${r}`
          }

          hotel_results.push(result)
        }
        return res.end(JSON.stringify(hotel_results));
      })
      .close();
  }
});
https.createServer(options, app).listen(port);
// app.listen(port);
console.log(`Server ${master.Status} is listening on ${port}`);
