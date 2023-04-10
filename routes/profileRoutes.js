const express = require('express');
const profile_router = express.Router();

profile_router.post('/saveProfile', (req, res) => {
    console.log('---Called /saveProfile---');
    res.send(' ---Save Profile ---');
})

profile_router.post('/postStatus', (req, res) => {
    console.log('---Called /postStatus---');
    res.send(' ---Post Status ---');
})

profile_router.post('/HHHHH', (req, res) => {
    console.log('---Called /HHHHH---');
    res.send(' ---HHHHHH ---');
})

module.exports = profile_router;