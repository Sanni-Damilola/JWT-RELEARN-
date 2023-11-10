import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";

export const encryptData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw new MainAppError({
        message: "Access Denied",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }
    console.log("jwt", jwt);
  } catch (error: any) {
    return next(error);
  }
};
