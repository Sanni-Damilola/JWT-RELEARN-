import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTPCODES, MainAppError } from "../Utils/MainAppError";
import { secretAccessToken } from "../jwt/jwtFn";

export const encryptData = (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) {
      throw new MainAppError({
        message: "Access Denied",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }
    const realToken = authorization.split(" ")[1];
    console.log("realToken", realToken);

    if (!realToken) {
      throw new MainAppError({
        message: "Unauthorized: Invalid token format",
        httpcode: HTTPCODES.UNAUTHORIZED,
      });
    }
    const { verify } = jwt;
    verify(
      realToken,
      secretAccessToken,
      (err: Error | null, payload: JwtPayload | any) => {
        if (err) {
          throw new MainAppError({
            message: err.message,
            httpcode: HTTPCODES.UNAUTHORIZED,
          });
        }

        req.user = payload;
        next();
      }
    );
  } catch (error: any) {
    return next(error);
  }
};
