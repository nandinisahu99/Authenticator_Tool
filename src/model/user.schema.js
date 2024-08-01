import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,

    validate: {
      validator: function (val) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(
          val
        );
      },
      message:
        "Password must contain: 1) At least 8 characters long\n2) Contains at least one uppercase letter\n3) Contains at least one lowercase lette\n4) Contains at least one digit\nContains at least one special character\n",
    },
  },
  method: {
    type: String,
    enum: ["email", "google", "facebook"],
    default: "email",
  },
  profileId: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and updating user resetPasswordToken
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 mins expiry time

  return resetToken;
};
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (err) {
    next(err);
  }
});
userSchema.methods.verifyPassword = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};
export const userModel = mongoose.model("User", userSchema);
