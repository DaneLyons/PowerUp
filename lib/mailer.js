var request = require('request');

var Mailer = {
  send: function (params, cb) {
    if (!params.to || !params.subject || !params.text) {
      return cb(new Error("Please provide 'to', 'subject', and 'text' in the parameters."))
    }
    
    if (!params.from) {
      params.from = "Team PowerUp <team@powerup.io>";
    }
    
    var mailUrl = "https://api.mailgun.net/v2/powerup.io/messages";
    request.post({
      url: mailUrl,
      form: params,
      auth: {
        user: "api",
        pass: "key-2fe8xp1rs1el6sh0f8vg2rv775nklmp5"
      }
    }, function (err, response, body) {
        if (err) { return cb(err); }
        
        return cb(null, response);
      }
    );
  }
};

module.exports = Mailer;
