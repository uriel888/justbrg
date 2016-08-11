import express from "express"
import * as list from "../tools/cityList.json"

let router = express.Router()


router.get('/', (req, res) => {
  if (!req.query.hint) {
    return res.status(500).send("Hints Wrong");
  }
  let result = [];
  let hint = req.query.hint.toLowerCase()
  for(let city in list){
    if(city.toLowerCase().startsWith(hint)){
      for(let region in list[city].region){
        result.push(city+", "+list[city].region[region]);
      }
    }
  }

  res.json(result);
});


module.exports = router;
