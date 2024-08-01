import { sendResetPasswordMail } from "../../configs/nodemailer.config.js";
import { ErrorHandler } from "../../utils/ErrorHandler.js";
import {
  clearTokenDetails,
  createUserRepo,
  getUserRepo,
} from "../model/user.repository.js";
import { hashToken } from "../../utils/hashToken.js";

export const renderLogin = (req, res, next) => {
  try {
    let message = req.flash("error");
    message = message.length > 0 ? message : "";
    res.render("login", { loggedIn: req.user, error: message });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(500, "Something went wrong"));
  }
};
export const renderRegister = (req, res, next) => {
  try {
    res.render("register", { loggedIn: req.user, error: false });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// This handler will render the updatePassword page
export const renderUpdatePassword = async (req, res, next) => {
  try {
    const user = await getUserRepo({ _id: req.user._id });
    if (user.password) {
      return res.render("updatePassword", {
        loggedIn: req.user,
        hasPassword: true,
        error: false,
      });
    } else {
      return res.render("updatePassword", {
        loggedIn: req.user,
        hasPassword: false,
        error: `You have registered with us using ${user.method}, therefore cannot update password here`,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// This handler will register a new user using the email
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new ErrorHandler(400, "All the fields are mandatory"));
    const user = await getUserRepo({ email: email });
    if (user)
      return res.render("register", {
        loggedIn: req.user,
        error: "User is already registered",
      });
    const newUser = await createUserRepo({ name, email, password });
    return res.render("login", {
      loggedIn: req.user,
      error: "Registration successful",
    });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// This handler will update the users password with the new password when the user is logged in
export const updatePassword = async (req, res, next) => {
  try {
    const user = await getUserRepo({ email: req.user.email });
    const { oldPassword, password, confirmPassword } = req.body;
    if (password != confirmPassword)
      res.render("updatePassword", {
        loggedIn: req.user,
        hasPassword: true,
        error: "New password and confirm password don't match",
      });
    const isValid = await user.verifyPassword(oldPassword);
    if (!isValid)
      return res.render("updatePassword", {
        loggedIn: req.user,
        hasPassword: true,
        error: "Incorrect old password",
      });
    else {
      user.password = password;
      await user.save(); //save function with automatically hash and save the password
      return res.render("updatePassword", {
        loggedIn: req.user,
        hasPassword: true,
        error: "Password updated successfully",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// This handler will take user's email and send a callback url to its email.
export const resetPassword = async (req, res, next) => {
  try {
    if (req.user) return res.redirect("/"); //if a user is logged in it will be redirected to the index page
    const { email } = req.body;
    const user = await getUserRepo({ email });
    if (!user)
      return res.render("resetPassword", {
        loggedIn: req.user,
        error: "User not found",
      });
    if (!user.password)
      //If the user has signed up using google then he will be shown an error message
      return res.render("resetPassword", {
        loggedIn: req.user,
        error: `You have registered with us using ${user.method}, please login using the same`,
      });
    const token = await user.getResetPasswordToken(); //generating the token hashing it and storing it in the document
    await user.save();
    const callbackUrl = `${process.env.BASE_URL}/user/set-password/${token}`;
    sendResetPasswordMail(email, callbackUrl);
    clearTokenDetails(user._id); //token will be cleared from the document after 10 mins
    return res.render("resetPassword", {
      loggedIn: false,
      error:
        "Please verify yourself by clicking on the link which we have sent you on your email",
    });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// This handler will render the reset passwrod page
export const renderResetPassword = async (req, res, next) => {
  try {
    if (req.user) return res.redirect("/"); //if a user is logged in it will be redirected to the index page
    res.render("resetPassword", { loggedIn: req.user, error: false });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// This handler will be invoked when the user clicks on the callback url sent on email
export const verifyTokenAndUpdatePassword = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) return next(new ErrorHandler(400, "Missing token"));

    const hashedToken = hashToken(token);

    const user = await getUserRepo({ resetPasswordToken: hashedToken });

    if (!user) return next(new ErrorHandler(400, "Invalid token"));

    let message = req.flash("error");
    message = message.length > 0 ? message : ""; //flash message will be displayed if redirected to this handler due to any error ahead

    if (user.resetPasswordExpire < Date.now())
      return next(new ErrorHandler(400, "Token expired"));

    return res.render("setNewPassword", {
      loggedIn: false,
      verifiedToken: token,
      error: message,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(500, error.message));
  }
};

export const setNewPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password != confirmPassword) {
      req.flash("error", "New Password and Confirm New Password don't match"); //storing the flash message
      return res.redirect(`/user/set-password/${token}`);
    } else {
      const hashedToken = hashToken(token);
      const user = await getUserRepo({ resetPasswordToken: hashedToken });
      if (!user) return next(new ErrorHandler(400, "Invalid token"));
      if (user.resetPasswordExpire < Date.now())
        return next(new ErrorHandler(400, "Token expired"));
      user.password = password; //updating the password
      await user.save(); //hashing the password and saving
      return res.render("login", {
        loggedIn: false,
        error: "Password reset successful",
      });
    }
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};
