import { userModel } from "./user.schema.js";

export const createUserRepo = async (user) => {
  const newUser = userModel(user);
  await newUser.save();
  return newUser;
};

export const getUserRepo = async (factor) => {
  return await userModel.findOne(factor);
};

export const findOrCreate = async (newUser) => {
  let user = await userModel.findOne({
    email: newUser.email,
  });
  if (user) return user;
  user = new userModel(newUser);
  await user.save();
  return user;
};

export const clearTokenDetails = (userId) => {
  setTimeout(async () => {
    await userModel.updateOne(
      { _id: userId },
      { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } }
    );
    console.log("Token details deleted");
  }, 10 * 60 * 1000); //Clearing token details after 10mins
};
