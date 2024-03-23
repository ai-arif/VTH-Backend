import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    
    console.log(`${process.env.MONGO_URI}/${DB_NAME}`)
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connection SUCCESS!", ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection FAIL!", error);
    process.exit(1);
  }
};

export default connectDB;
