"use strict";
let fs = require('fs')
let outputFilename = './SPGCONVERTER.json'
let hotels = require('./SPGCONVERTER.json')

for(let hotel in hotels){
  if(!hotels[hotel].address){
    console.log(hotel);
    // hotels[hotel].address = 'TOADDADDRESS'
  }
  if(!hotels[hotel].geo){
    console.log(hotel);
    // hotels[hotel].geo = 'TOADDGEO'
  }
  if(!hotels[hotel].img){
    console.log(hotel);
    // hotels[hotel].img = 'TOADDIMG'
  }
}
//
// fs.writeFile(outputFilename, JSON.stringify(hotels, null, 4), function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("JSON saved to " + outputFilename);
//   }
// })
