import mongoose from "mongoose";

export async function db() {
  try {
    const connect = await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log(`DB connected, HOST: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}
