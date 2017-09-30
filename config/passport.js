const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

//Load User Model
const User = mongoose.model('users');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profileInfo, done) => {
            // console.log('Access Token', accessToken);
            // console.log('Profile', profileInfo);

            const fullImage = profileInfo.photos[0].value.substring(0, profileInfo.photos[0].value.indexOf('?'));

            const newUser = {
                googleID: profileInfo.id,
                email: profileInfo.emails[0].value,
                firstName: profileInfo.name.givenName,
                lastName: profileInfo.name.familyName,
                profilePicture: fullImage
            }

            //Check for existing User (using googleID)
            User.findOne(
                { googleID: profileInfo.id }
            )
                .then(
                (user) => {
                    if (user) {
                        //Return existing User
                        console.log('FOUND EXISTING USER');
                        done(null, user);
                    } else {
                        //Create new User
                        new User(newUser)
                            .save()
                            .then(user => done(null, user))
                            .catch(err => console.log(`ERROR ON CREATING NEW USER: ${err}`));
                    }
                }
                )
                .catch(
                (err) => {
                    console.log(`ERROR ON FINDING EXISTING USER: ${err}`);
                }
                )
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
}