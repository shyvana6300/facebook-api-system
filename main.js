const express = require('express'); 
const helmet = require('helmet'); 
const app = express();
const cors = require("cors");
// const baseRoute = require('./routes/baseRoute.js');

// Init cors option for middleware
var corsOptions = {
    origin: "http://localhost:8081"
  };
// middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for '/account' route
// app.use('/account', accountRoute);
require('./routes/accountRoutes')(app);

// Route for '/user' route
// app.use('/profile', profileRoute);

const db = require("./model/baseModel");
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