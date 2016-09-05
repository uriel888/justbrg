import mongoose from "mongoose";


let Schema = mongoose.Schema;
let countSchema = new Schema({
  username: String,
  search_count: {type: Number, default: 0},
})


module.exports = mongoose.model('Count', countSchema);;
