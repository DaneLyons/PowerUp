var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
var signUpSchema = new Schema({
  userData: {}
});

var SignUp = mongoose.model('SignUp', signUpSchema);
module.exports = SignUp;
