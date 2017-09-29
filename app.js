const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const expSession = require('express-session');
const cookieParser = require('cookie-parser');

//Load keys
const keys = require('./config/keys');

//Mongoose Connect
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
})
.then(
    () => {
        setTimeout(() => {
            console.log(`Connected to database`);
        }, 1200)
    }
)
.catch(
    (err) => {
        console.log(`ERROR ON DB CONNECTION: ${err}`);
    }
);

//Express Variable
const app = express();

//Load Models
require('./models/User');

//Passport Config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

//CookieParser Middleware
app.use(cookieParser());

//Express Session Middleware
app.use(expSession({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Global Variables
app.use((req, res, next) => {
    res.locals.user = req.users || null;
    next();
});

//Use Routes
app.use('/', index);
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