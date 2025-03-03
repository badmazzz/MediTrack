import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import connectDB from "./db/index.js";
import app from "./app.js";


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`The app is listening on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("ERROR: ", err);
  });
