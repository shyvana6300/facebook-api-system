const express = require('express'); 
const helmet = require('helmet'); 
const app = express();
const cors = require("cors");
const cookieSession = require("cookie-session");
const accountRoute = require('./routes/accountRoutes');
const profileRoute = require('./routes/profileRoutes.js');
const db = require("./models/baseModel");
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
// Route for '/account' route
app.use('/account', accountRoute);
// Route for '/user' route
app.use('/profile', profileRoute);

app.get("/", (req, res) => {
    res.status(200).send("Hello World!");
  });
// db.sequelize.sync({force: true})
db.sequelize.sync()
  .then(() => {
    console.log("Database is connected and synced!");
  })
  .catch((err) => {
    console.log("Database connection failed: " + err.message);
  });

// Create Environment variable for port
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`The API system is running on ${PORT}...`);
});

module.exports = server;