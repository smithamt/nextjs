import mongoose from "mongoose";

const connectMongo = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("already connect");
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("mongodb connected");
    return true;
  } catch (error) {
    console.log("error");
  }
};

export default connectMongo;
