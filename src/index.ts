import express, { Application } from "express";
import { EnvironmentVariables } from "./Config/EnvironmentVariables";
import { DBCONNECTION } from "./Config/Database";
import { MainAppConfig } from "./app";

// The port of our backend server
const port: number = Number(EnvironmentVariables.PORT);

// Extantiating our server from express
const app: Application = express();

// Connecting main app configuration
MainAppConfig(app);

// Connecting DB to server:
DBCONNECTION();

// Server is connected and listening to port
const server = app.listen(port, () => {
  console.log("");

  console.log(
    "Server is up and running 🚀🚀 \n Listening to port on port ",
    port
  );
});

// Preventing the server from crashing
process.on("uncaughtException", (error: Error) => {
  console.log("Server is Shutting down due to uncaughtException", error);
  process.exit(1);
});
process.once("unhandledRejection", (reason: Error) => {
  console.log("Server is Shutting down due to unhandledRejection", reason);
  server.close(() => {
    process.exit(1);
  });
});
