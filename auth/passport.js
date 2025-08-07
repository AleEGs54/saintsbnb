// auth/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Auth0Strategy = require('passport-auth0');
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

    // --- Auth0 Strategy (for GitHub login) ---
    if (process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET) {
        passport.use(
            new Auth0Strategy(
                {
                    domain: process.env.AUTH0_DOMAIN,
                    clientID: process.env.AUTH0_CLIENT_ID,
                    clientSecret: process.env.AUTH0_CLIENT_SECRET,
                    callbackURL: process.env.AUTH0_CALLBACK_URL,
                },
                async (
                    accessToken,
                    refreshToken,
                    extraParams,
                    profile,
                    done,
                ) => {
                    try {
                        let user = await User.findOne({ auth0Id: profile.id });

                        if (user) {
                            return done(null, user);
                        } else {
                            user = new User({
                                auth0Id: profile.id,
                                name: profile.displayName || profile.nickname,
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
            'Auth0 credentials not found in .env. GitHub login will not be available until configured.',
        );
    }
};
