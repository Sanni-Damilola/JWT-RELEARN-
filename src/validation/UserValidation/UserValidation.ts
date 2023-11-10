import validationSetUp from "../validatorSetUp";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { UserSchemaValidation } from "./UserSchema";

export const ValidateUserSignUp: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationSetUp(UserSchemaValidation.UserSignUp, req.body, next);
};

export const ValidateUserLogin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationSetUp(UserSchemaValidation.UserLogin, req.body, next);
};

export const ValidateUserOTP: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationSetUp(UserSchemaValidation.UserOTP, req.body, next);
};
