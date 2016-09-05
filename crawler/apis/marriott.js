import https from 'https';
import request from 'request'
import zlib from 'zlib'
import moment from "moment"

let process_body = function(body, req, res) {
  let hotel_results = [];
  // console.log(body);
  let hotels = JSON.parse(body).propertiesRooms;
  let checkin = moment(req.query.checkin, "YYYY-MM-DD").format("MM/DD/YY")
  let checkout = moment(req.query.checkout, "YYYY-MM-DD").format("MM/DD/YY")
  for (let index in hotels) {
    let hotel = hotels[index];
    let result = {};
    result.hotel_name = hotel.property.name;
    if (!hotel.available) {} else {
      result.BAR = hotel.rate.baseRate.localeValue / (Math.pow(10, hotel.rate.baseRate.localeValueDecimalPoint));
    }

    result.geo = {}

    result.geo.lat = hotel.property.location.latitude;
    result.geo.lng = hotel.property.location.longitude;
    if (hotel.property.primaryImage != undefined) {
      result.img = hotel.property.primaryImage.images[0].url
    }
    let r = Math.floor(Math.random() * 10000000) / 10000000;
    let fileName = result.hotel_name.replace(/,/g, '').replace(/ /g, '_');
    result.targetURL = fileName == undefined ? undefined : `https://hotels.justbrg.com/Hotel/SearchResults?checkin=${req.query.checkin}&checkout=${req.query.checkout}&Rooms=1&adults_1=2&fileName=${fileName}&r=${r}`
    result.officialURL = `http://www.marriott.com/reservation/availabilitySearch.mi?propertyCode=${hotel.property.id}&isSearch=false&isRateCalendar=false&flexibleDateSearchRateDisplay=false&flexibleDateLowestRateMonth=&flexibleDateLowestRateDate=&fromDate=${checkin}&toDate=${checkout}&clusterCode=&corporateCode=&groupCode=&numberOfRooms=1&numberOfGuests=1&incentiveType_Number=&incentiveType=false&marriottRewardsNumber=&useRewardsPoints=false&numberOfChildren=0&childrenAges=&numberOfAdults=1`
    hotel_results.push(result);

    if (hotel_results.length >= 33) {
      break;
    }
  }
  res.json(hotel_results);
}

module.exports = function(req, res, json) {
  json = json.replace(/\+/g, ' ')
  let options = {
    url: 'https://gatewaydsapprd.marriott.com/v1/properties_rooms/search',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Marriott/5.12.0 (iPhone; iOS 9.3.2; Scale/3.00)',
      'Accept': '*/*',
      'Authorization': 'Basic aW9zOmRzYXBzZWNyZXQxMjM=',
      'Connection': 'keep-alive',
      // 'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US',
      'Host': 'gatewaydsapprd.marriott.com'
    },
    body: json,
  }
  request.post(options, function(error, response, body) {
    if (!error) {
      let encoding = response.headers['content-encoding'];
      console.log(encoding);
      if (encoding == 'gzip') {
        body = body.toString("binary");
        body = new Buffer(body, "binary");
        zlib.gunzip(body, function(err, decoded) {
          if (err) {
            console.log(err);
          } else {
            console.log(decoded);
            data = decoded.toString();
            process_body(data, req, res);
          }
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(body, function(err, decoded) {
          data = decoded.toString();
          process_body(data, req, res);
        });
      } else {
        process_body(body, req, res);
      }
    } else {
      res.json(error);
      console.log("ERROR::::  " + error);
    }
  });
};
