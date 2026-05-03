const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

const User = require("../models/user");

// ✅ Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL, // e.g. http://localhost:5000/auth/google/callback
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 🔍 Check if user already exists
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          // ✅ Create new user
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            userType: "User", // default role
            password: "google-auth", // dummy password
          });

          await user.save();
        }

        return done(null, user); // ✅ success
      } catch (error) {
        return done(error, null); // ❌ error handled correctly
      }
    }
  )
);

// ✅ Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ✅ Get user from DB using ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await require("../models/user").findById(id);
    done(null, user); // ✅ correct
  } catch (error) {
    done(error, null); // ✅ correct
  }
});