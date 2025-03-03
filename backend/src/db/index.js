import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("MONGODB Connected");
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
};

export default connectDB;
