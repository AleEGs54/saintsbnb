// auth/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const OAuth2Strategy = require('passport-oauth2').Strategy; // Example for a generic OAuth2 strategy, if needed later
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

    // --- Placeholder for a Generic OAuth Strategy (will be implemented by other team member) ---
    // When the specific OAuth provider is known (Google, GitHub, etc.),
    // this section will be replaced with the relevant Passport strategy.
    // Example (conceptual):
    /*
    if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) {
        // You would use a specific strategy here, e.g., new GoogleStrategy(...)
        // For now, it's just a conceptual placeholder
        passport.use(new SomeOAuthStrategy({
            clientID: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            callbackURL: process.env.OAUTH_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // The 'profile' object structure depends on the OAuth provider.
                // You'll need to extract provider-specific ID (e.g., profile.id)
                // and map it to your 'providerID' field.
                let user = await User.findOne({ providerID: profile.id }); // Use profile.id as the generic providerID

                if (user) {
                    return done(null, user);
                } else {
                    user = new User({
                        name: profile.displayName || profile.username || 'OAuth User', // Get name
                        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null, // Get email
                        providerID: profile.id, // Store the generic provider ID
                        role: 'guest'
                    });
                    await user.save();
                    return done(null, user);
                }
            } catch (err) {
                return done(err);
            }
        }));
    } else {
        console.warn("Generic OAuth credentials not found in .env. OAuth login will not be available until configured.");
    }
    */
};
