const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require('passport');
const expSession = require('express-session');
const cookieParser = require('cookie-parser');

//Load keys
const keys = require('./config/keys');

//Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

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

//Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Load Models
require('./models/User');
require('./models/Story');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Method Override Middleware
app.use(methodOverride('_method'));

//Passport Config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

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
    res.locals.user = req.user || null;
    next();
});

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

//PORT
const port = process.env.PORT || 3000;

//Start server
app.listen(port, () => {
    console.log(`Server starting...`);
    setTimeout(() => {
        console.log(`Server started on port ${port}`);
    }, 1000);
});