const express = require('express');
const app = express();

var user = [
    {
        name: 'user1',
        age: 12
    },
    {
        name: 'user2',
        age: 21
    }
]
app.get('/', (req, res) => {
    console.log('New request has just called!');
    res.send('Welcome to API System');
    res.end();
}
);

app.get('/user', (req, res) => {
    console.log('--- Request: get list user ---');
    res.send('User List: ', user);
    res.end();
}
);

app.post('/user/register', (req, res) => {
    console.log('--- Execute Create New Account ---')
    res.send();
    res.end();
}
);

// Create Environment variable for port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The API system is running on ${port}...`);
});