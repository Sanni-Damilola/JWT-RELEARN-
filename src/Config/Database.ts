import mongoose from "mongoose";
import { EnvironmentVariables } from "./EnvironmentVariables";

const DB_Connection_String: string | undefined =
  EnvironmentVariables.DB_LOCALURL!;

export const DBCONNECTION = async () => {
  try {
    await mongoose.connect(DB_Connection_String);
    console.log("");
    if (mongoose.connection.host === "0.0.0.0") {
      console.log("You're Connected to Local Host"); // if connected to local database
    } else {
      console.log("You're Connected To Live"); // if connected to cloud database
    }
  } catch (error) {
    console.log("Database connection error. Couldn't connect because ", error);
  }
};
