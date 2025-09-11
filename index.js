// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/:dateTime?", function (req, res, next) {
  if (req.params.dateTime == null) {
    var dateTimeObject = new Date();
  } else {
    numberCheck = /^\d+$/.test(req.params.dateTime);
    if (numberCheck === true) {
      var timestamp = parseInt(req.params.dateTime, 10);
      var dateTimeObject = new Date(timestamp);
    } else {
      var dateTimeObject = new Date(req.params.dateTime);
    }
  };
  var formattedDateTime = dateTimeObject.toUTCString();
  var unixDateTime = dateTimeObject.getTime();
  if (formattedDateTime === "Invalid Date") {
    res.json({ error: formattedDateTime });
  } else {
    res.json({ unix: unixDateTime, utc: formattedDateTime });
  }
  next();
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
