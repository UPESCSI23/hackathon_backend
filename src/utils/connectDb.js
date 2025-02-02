import { connect } from "mongoose";
import { config } from "dotenv";

config({ path: "./.env" });

export const connectDb = async () => {
  try {
    const connection = await connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`,
    );
    console.log("Connected to database", connection.connection.host);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
