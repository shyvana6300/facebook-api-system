const express = require('express');
const app = express();
const accountRoute = require('./routes/accountRoutes');
const profileRoute = require('./routes/profileRoutes.js');

// Route for '/account' route
app.use('/account', accountRoute);

// Route for '/user' route
app.use('/profile', profileRoute);

// Create Environment variable for port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The API system is running on ${port}...`);
});