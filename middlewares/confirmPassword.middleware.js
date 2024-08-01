export const confirmPasswords = (req, res, next) => {
  if (req.body.password != req.body.confirmPassword)
    return res.render("register", {
      loggedIn: req.user,
      error: "Password and Confirm Password don't match",
    });
  else next();
};
