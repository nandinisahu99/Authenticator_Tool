import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { userModel } from "../src/model/user.schema.js";
import { findOrCreate } from "../src/model/user.repository.js";

// Local strategy
passport.use(
  new LocalStrategy({ passReqToCallback: true }, function (
    req,
    username,
    password,
    next
  ) {
    userModel.findOne({ email: username }).then((user) => {
      if (!user) {
        req.flash("error", "User is not registered");
        return next(null, false);
      }
      if (user.password) {
        user.verifyPassword(password).then((isValid) => {
          if (!isValid) {
            req.flash("error", "Invalid password");
            return next(null, false);
          }
          return next(null, user);
        });
      } else {
        req.flash(
          "error",
          `You have registered with us using ${user.method}, please login with the same`
        );
        return next(null, false);
      }
    });
  })
);

// Google OAuth2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/auth/google/callback`,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, next) {
      const user = {
        name: profile.displayName,
        profileId: profile.id,
        method: "google",
        email: profile._json.email,
      };
      findOrCreate(user).then((user) => {
        //if the user is present it will retrieve or else a new user will be created and returned
        return next(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, next) {
  //serializer will take the user and store its id in the session storage
  next(null, user._id);
});
passport.deserializeUser(function (id, next) {
  //deserializer will take the id from session storage and retrieve the user and will add it to the req object
  userModel.findOne({ _id: id }).then((user) => {
    if (!user) {
      return next(err);
    } else {
      return next(null, user);
    }
  });
});
export default passport;
