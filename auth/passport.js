const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');
require('dotenv').config();

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    // --- Passport Local Strategy (for email/password login) ---
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email }).select(
                        '+password',
                    );

                    if (!user) {
                        return done(null, false, {
                            message: 'Incorrect email or password.',
                        });
                    }

                    const isMatch = await user.isValidPassword(password);

                    if (!isMatch) {
                        return done(null, false, {
                            message: 'Incorrect email or password.',
                        });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            },
        ),
    );

    // --- Github Strategy ---
    if (process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET) {
        passport.use(
            new GithubStrategy(
                {
                    clientID: process.env.AUTH0_CLIENT_ID,
                    clientSecret: process.env.AUTH0_CLIENT_SECRET,
                    callbackURL: process.env.AUTH0_CALLBACK_URL,
                },
scope: [ 'user:email'];
                async (accessToken, refreshToken, profile, done) => {
                    try {
                        let user = await User.findOne({ auth0Id: profile.id });

                        if (user) {
                            return done(null, user);
                        } else {
                            let userEmail = null;
                            if (profile.emails && profile.emails.length > 0) {
                                userEmail = profile.emails[0].value;
                            } else if (profile._json && profile._json.email) {
                                userEmail = profile._json.email;
                            }

                            if (!userEmail) {
                                return done(
                                    new Error(
                                        'Email is required for registration.',
                                    ),
                                    null,
                                );
                            }

                            user = new User({
                                auth0Id: profile.id,
                                name: profile.displayName || profile.username,
                                email:
                                    profile.emails && profile.emails.length > 0
                                        ? profile.emails[0].value
                                        : null,
                                role: 'guest',
                            });
                            await user.save();
                            return done(null, user);
                        }
                    } catch (err) {
                        return done(err);
                    }
                },
            ),
        );
    } else {
        console.warn(
            'Github credentials not found in .env. Github login will not be available until configured.',
        );
    }
};
