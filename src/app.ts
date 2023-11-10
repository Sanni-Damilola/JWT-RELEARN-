import express, { Application, Response, Request, NextFunction } from "express";

import cors from "cors";

import morgan from "morgan";
import { HTTPCODES, MainAppError } from "./Utils/MainAppError";
import { errorHandler } from "./Middlewares/Errors/ErrorHandler";
import UserRoute from "./Routes/UserRoutes";

export const MainAppConfig = (app: Application) => {
  app
    .set("view engine", "ejs")
    .use(express.static("public"))
    .use(express.static(`${__dirname}/public/css`))
    .use(express.json())
    .use("/view", (req: Request, res: any) => {
      try {
        res.render("adminMail");
      } catch (error) {
        console.log("an error occured app(line 17 (set: view))", error);
      }
    })
    .use(cors())
    .use(morgan("dev"))
    .get("/", (req: Request, res: Response) => {
      res.status(HTTPCODES.OK).json({
        message: "Mula Wallet Api is Ready 🚀🚀".toUpperCase(),
      });
      // landing route
    })
    .use("/api/users", UserRoute) // user Routes
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      //   Configuring Routes for the application:
      return next(
        new MainAppError({
          message: `Are You Lost? ${req.originalUrl} Not found`,
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }) // 404 Routes
    .use(errorHandler); // error handler
};
