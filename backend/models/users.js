import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;
let userSchema = new Schema({
  local: {
    username: String,
    password: String,
  }
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);;
