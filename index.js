import { app } from "./server.js"; //importing the server file before so that dotenv initiaization is taken care off
import { connectToDB } from "./configs/mongo.config.js";

const PORT = process.env.PORT || 3000;
app.listen(PORT, async (err) => {
  if (err) console.log(err);
  else {
    await connectToDB();
    console.log("Server is active");
  }
});
