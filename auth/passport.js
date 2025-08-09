const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const axios = require('axios');
const User = require('../models/userModel');
require('dotenv').config();

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    // Serialize user ID into the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from ID in the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    /**
     * Local Strategy (email + password login)
     */
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

    /**
     * GitHub OAuth Strategy
     */
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        passport.use(
            new GithubStrategy(
                {
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: process.env.GITHUB_CALLBACK_URL,
                    scope: ['user:email'],
                },
                async (accessToken, refreshToken, profile, done) => {
                    try {
                        let user = await User.findOne({ githubId: profile.id });

                        // If no user with githubId, check by email
                        if (!user) {
                            let userEmail = null;

                            // Try to get email from profile
                            if (profile.emails && profile.emails.length > 0) {
                                userEmail = profile.emails[0].value;
                            } else if (profile._json && profile._json.email) {
                                userEmail = profile._json.email;
                            }

                            // If no email in profile, fetch from GitHub API
                            if (!userEmail) {
                                const { data } = await axios.get(
                                    'https://api.github.com/user/emails',
                                    {
                                        headers: {
                                            Authorization: `token ${accessToken}`,
                                        },
                                    },
                                );
                                const primaryEmail = data.find(
                                    (email) => email.primary && email.verified,
                                );
                                if (primaryEmail) {
                                    userEmail = primaryEmail.email;
                                }
                            }

                            if (!userEmail) {
                                return done(
                                    new Error(
                                        'Email is required for registration.',
                                    ),
                                    null,
                                );
                            }

                            // Check if email already exists
                            const existingUser = await User.findOne({
                                email: userEmail,
                            });
                            if (existingUser) {
                                // Link GitHub to existing user
                                existingUser.githubId = profile.id;
                                await existingUser.save();
                                return done(null, existingUser);
                            }

                            // Create new user
                            user = new User({
                                githubId: profile.id,
                                name: profile.displayName || profile.username,
                                email: userEmail,
                                role: 'guest',
                            });
                            await user.save();
                            return done(null, user);
                        }

                        // User with githubId found
                        return done(null, user);
                    } catch (err) {
                        return done(err);
                    }
                },
            ),
        );
    }
};
