import express from 'express'
import passport from "passport"
import morgan from "morgan"
import bodyParser from "body-parser"
import * as master from "./configs/master.json"
import Horseman from "node-horseman"
import {
  encrypt,
  decrypt
} from "./tools/crypt.js"


let horseman = new Horseman();
let app = express();
let port = process.env.PORT || master.dev_port;

//Enable logs on requests
if (master.Status == "dev") {
  app.use(morgan(`${master.Status}`));
} else {
  port = process.env.PORT || master.port;
}

//Enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/:encode', (req, res) => {
  let url = decrypt(req.params.encode);
  //TODO: ADD VERIFICATION

  horseman
  .open(url)
  .then((text)=>{
    res.end(text);
  })
  .close();
});
app.listen(port);
console.log(`Server ${master.Status} is listening on ${port}`);
