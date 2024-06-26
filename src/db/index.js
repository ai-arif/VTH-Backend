import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    
   
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}`
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
