import { Router } from "express";
import {
  registerUser,
  renderLogin,
  renderRegister,
  renderResetPassword,
  renderUpdatePassword,
  resetPassword,
  setNewPassword,
  updatePassword,
  verifyTokenAndUpdatePassword,
} from "../controller/user.controller.js";
import passport from "../../configs/passport.config.js";
import { checkAccess } from "../../middlewares/checkAccess.js";
import { confirmPasswords } from "../../middlewares/confirmPassword.middleware.js";
export const userRoutes = Router();

// GET Routes

userRoutes.get("/login", renderLogin);
userRoutes.get("/register", renderRegister);
userRoutes.get("/update-password", checkAccess, renderUpdatePassword);
userRoutes.get("/logout", function (req, res) {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});
userRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

userRoutes.get("/reset-password/", renderResetPassword);
userRoutes.get("/set-password/:token", verifyTokenAndUpdatePassword);

// POST Routes
userRoutes.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log(req.user);
    res.redirect("/");
  }
);
userRoutes.post("/register", confirmPasswords, registerUser);
userRoutes.post("/update-password", checkAccess, updatePassword);
userRoutes.post("/reset-password/", resetPassword);
userRoutes.post("/set-password/:token", setNewPassword);
