var request = require('request');

var Mailer = {
  send: function (params, cb) {
    if (!params.to || !params.subject || !params.text) {
      return cb(new Error("Please provide 'to', 'subject', and 'text' in the parameters."))
    }
    
    if (!params.from) {
      params.from = "team@powerup.io";
    }
    
    var mailUrl = "https://api.mailgun.net/v2/powerup.io/messages";
    request.post({
      url: mailUrl,
      json: params
    }, function (err, response, body) {
        if (err) { return cb(err); }
        
        return cb(null, response);
      }
    ).auth("api", process.env.MAILGUN_API_KEY);
  }
};

module.exports = Mailer;
