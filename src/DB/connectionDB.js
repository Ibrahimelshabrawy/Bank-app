import mongoose, {connect} from "mongoose";
import {MONGO_URI} from "../../config/config.service.js";

const connectDB = async () => {
  try {
    await connect(MONGO_URI, {serverSelectionTimeoutMS: 9000});
    console.log(`Connect To DB ${MONGO_URI} Successfully 🥳🥳`);
  } catch (error) {
    console.log(error);

    console.log("Connect To DB Failed ❗");
  }
};

export default connectDB;
