const express = require("express");
const mongoose = require("mongoose");

//Express Variable
const app = express();

//Index route
app.get('/', (req, res) => {
    res.send('It works');
});

//PORT
const port = process.env.PORT || 3000;

//Start server
app.listen(port, () => {
    console.log(`Server starting...`);
    setTimeout(() => {
        console.log(`Server started on port ${port}`);
    }, 1000);
});