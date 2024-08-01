import mongoose from "mongoose";

const url = process.env.MONGO_URL || "mongodb://localhost:27017/Authenticator";
export const connectToDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected!");
  } catch (err) {
    console.log("DB connection failed" + err);
  }
};
