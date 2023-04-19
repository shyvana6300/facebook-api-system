const express = require('express'); 
const helmet = require('helmet'); 
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const accountRoute = require('./routes/accountRoutes');
const activityRoute = require('./routes/activityRoutes');

// Init cors option for middleware
var corsOptions = {
    origin: "http://localhost:8081"
  };

// Use cors for middleware
app.use(cors(corsOptions));
// Use helmet for security
app.use(helmet());
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// use cookei session
app.use(
  cookieSession({
    name: "shyvana-test-session",
    secret: "COOKIE_SECRET_KEY", // should use as secret environment variable
    httpOnly: true
  })
);
// use static folder
app.use(express.static('static/img/avatar'));
app.use(express.static('static/img/status'));
app.use('/avatar', express.static('static/img/avatar'));
app.use('/status', express.static('static/img/status'));
// Route for '/account' route
app.use('/account', accountRoute);
// Route for '/user' route
app.use('/activity', activityRoute);

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });

module.exports = app;