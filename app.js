const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');

//Express Variable
const app = express();

//Passport Config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');


//Index route
app.get('/', (req, res) => {
    res.send('It works');
});

//Use Routes
app.use('/auth', auth);

//PORT
const port = process.env.PORT || 3000;

//Start server
app.listen(port, () => {
    console.log(`Server starting...`);
    setTimeout(() => {
        console.log(`Server started on port ${port}`);
    }, 1000);
});