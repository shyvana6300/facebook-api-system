const express = require('express'); 
const helmet = require('helmet'); 
const app = express();
const cors = require("cors");
const accountRoute = require('./routes/accountRoutes');
const profileRoute = require('./routes/profileRoutes.js');
const db = require("./model/baseModel");
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

// Route for '/account' route
app.use('/account', accountRoute);
// Route for '/user' route
app.use('/profile', profileRoute);

db.sequelize.sync( {force: true})
  .then(() => {
    console.log("Database is connected and synced!");
  })
  .catch((err) => {
    console.log("Database connection failed: " + err.message);
  });

// Create Environment variable for port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The API system is running on ${PORT}...`);
});