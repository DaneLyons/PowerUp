var request = require('request');

var Mailer = {
  send: function (params, cb) {
    if (!params.to || !params.subject || !params.text) {
      return cb(new Error("Please provide 'to', 'subject', and 'text' in the parameters."))
    }
    
    if (!params.from) {
      params.from = "team@powerup.io";
    }
    
    var mailUrl = "https://api.mailgun.net/v2/samples.mailgun.org/messages";
    request.auth("api", process.env.MAILGUN_API_KEY)
      .post(mailUrl, params, function (err, response, body) {
        if (err) { return cb(err); }
        
        return cb(null, response);
      }
    );
  }
};