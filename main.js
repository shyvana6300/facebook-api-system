const express = require('express');
const app = express();
const accountRoute = require('./routes/accountRoutes');
const profileRoute = require('./routes/profileRoutes.js');

// Init cors option for middleware
var corsOptions = {
    origin: "http://localhost:8081"
  };

// Use cors for middleware
app.use(cors(corsOptions));

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Route for '/account' route
app.use('/account', accountRoute);

// Route for '/user' route
app.use('/profile', profileRoute);

const db = require("./model/baseModel");
db.sequelize.sync()
  .then(() => {
    console.log("Database is Synced!");
  })

// Create Environment variable for port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The API system is running on ${port}...`);
});