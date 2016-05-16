import  express       from  "express"
import  passport      from  "passport"
import  * as  master  from  "../configs/master.json"
import  User          from  "../models/users.js"
let router = express.Router()

if(master.Status == "dev"){
  router.get(`/test${master.Status}`, (req, res) => {
    res.end("GOOD TEST");
  });

  router.get('/', (req, res) => {
    res.send(req.user);
  });
}

module.exports = router;
