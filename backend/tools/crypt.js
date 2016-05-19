export function encrypt(text) {
  var cipher = crypto.createCipher(master.algorithm, master.password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt(text) {
  var decipher = crypto.createDecipher(master.algorithm, master.password)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}
