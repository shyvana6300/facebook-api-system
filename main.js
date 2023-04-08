const express = require('express');
const app = express();

app.get('/', (req, res) => {
    console.log('New request has just called!');
    res.send('Welcome to API System');
    res.end();
}
);

app.post('/user/register', (req, res) => {
    console.log('--- Execute Create New Account ---')
    res.send('Create new account!');
    res.end();
}
);

// Create Environment variable for port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The API system is running on ${port}...`);
});