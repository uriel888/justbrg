import express from 'express'
import passport from "passport"
import morgan from "morgan"
import bodyParser from "body-parser"
import {
  encrypt, decrypt
} from "../tools/crpyt.js"


let app = express();
const port = process.env.PORT || master.port;

//Enable logs on requests
if (master.Status == "dev") {
  app.use(morgan(`${master.Status}`));
}

//Enable body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.get('/:encode', (req, res) => {
  res.end(decrypt(req.params.encode));
});
app.listen(port);
console.log(`Server ${master.Status} is listening on ${master.port}`);
